#!/usr/bin/env node

/**
 * Script to help migrate API routes to Phase 2 structure
 * This generates a migration report and helps identify which routes need updates
 */

const fs = require('fs');
const path = require('path');

function findAllRoutes() {
  const routes = [];
  const apiDir = path.join(process.cwd(), 'app/api');

  function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (file === 'route.ts') {
        routes.push(fullPath);
      }
    });
  }

  walk(apiDir);
  return routes.sort();
}

function analyzeRoute(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const hasMiddleware = content.includes('withMiddleware');
  const hasValidation = content.includes('validateBody') || content.includes('validateQuery');
  const hasCsrf = content.includes('CSRF') || content.includes('csrf');
  const hasRateLimit = content.includes('rateLimit');
  const hasAuth = content.includes('auth.api.getSession') || content.includes('session');
  const hasTenantId = content.includes('tenantId');

  const methods = [];
  if (content.includes('export async function GET')) methods.push('GET');
  if (content.includes('export async function POST')) methods.push('POST');
  if (content.includes('export async function PUT')) methods.push('PUT');
  if (content.includes('export async function DELETE')) methods.push('DELETE');
  if (content.includes('export async function PATCH')) methods.push('PATCH');

  return {
    path: filePath,
    methods,
    hasMiddleware,
    hasValidation,
    hasCsrf,
    hasRateLimit,
    hasAuth,
    hasTenantId,
    score: (hasMiddleware ? 20 : 0) + (hasValidation ? 20 : 0) + (hasCsrf ? 20 : 0) + (hasRateLimit ? 20 : 0) + (hasTenantId ? 20 : 0),
  };
}

function main() {
  console.log('\n=== PHASE 2 ROUTE MIGRATION ANALYSIS ===\n');

  const routes = findAllRoutes();
  console.log(`Found ${routes.length} API routes\n`);

  const analysis = routes.map(analyzeRoute);

  // Sort by completion score
  analysis.sort((a, b) => b.score - a.score);

  const completed = analysis.filter(r => r.score === 100);
  const partial = analysis.filter(r => r.score > 0 && r.score < 100);
  const notStarted = analysis.filter(r => r.score === 0);

  console.log(`✓ Completed (100%): ${completed.length}`);
  console.log(`⚠ Partial: ${partial.length}`);
  console.log(`✗ Not Started: ${notStarted.length}\n`);

  // Show routes needing work
  console.log('ROUTES NEEDING MIDDLEWARE INTEGRATION:\n');
  notStarted.slice(0, 10).forEach(route => {
    const relPath = route.path.replace(process.cwd() + '/', '');
    console.log(`  ${relPath} [${route.methods.join('/')}]`);
  });

  if (notStarted.length > 10) {
    console.log(`  ... and ${notStarted.length - 10} more\n`);
  }

  // Generate summary stats
  console.log('\nINTEGRATION CHECKLIST:');
  console.log(`  [ ] Middleware: ${analysis.filter(r => r.hasMiddleware).length}/${routes.length}`);
  console.log(`  [ ] Validation: ${analysis.filter(r => r.hasValidation).length}/${routes.length}`);
  console.log(`  [ ] CSRF: ${analysis.filter(r => r.hasCsrf).length}/${routes.length}`);
  console.log(`  [ ] Rate Limit: ${analysis.filter(r => r.hasRateLimit).length}/${routes.length}`);
  console.log(`  [ ] Tenant: ${analysis.filter(r => r.hasTenantId).length}/${routes.length}\n`);

  // Output JSON for programmatic use
  fs.writeFileSync(
    'scripts/migration-report.json',
    JSON.stringify({ routes: analysis, summary: { completed: completed.length, partial: partial.length, notStarted: notStarted.length } }, null, 2)
  );
  console.log('Report saved to: scripts/migration-report.json');
}

main();
