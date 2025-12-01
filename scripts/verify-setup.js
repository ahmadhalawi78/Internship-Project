#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this to verify your Supabase Auth setup is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Supabase Auth Setup...\n');

let hasErrors = false;

// Check for .env.local file
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    console.log('   → Create it by copying .env.example: cp .env.example .env.local\n');
    hasErrors = true;
} else {
    console.log('✅ .env.local file exists');
    
    // Check for required environment variables
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    
    requiredVars.forEach(varName => {
        if (envContent.includes(varName)) {
            const regex = new RegExp(`${varName}=(.+)`);
            const match = envContent.match(regex);
            if (match && match[1] && !match[1].includes('your_')) {
                console.log(`✅ ${varName} is set`);
            } else {
                console.log(`⚠️  ${varName} is not configured (still has placeholder value)`);
                hasErrors = true;
            }
        } else {
            console.log(`❌ ${varName} is missing`);
            hasErrors = true;
        }
    });
}

// Check for required files
console.log('\n📁 Checking required files...');
const requiredFiles = [
    'src/frontend/lib/supabase/client.ts',
    'src/backend/lib/supabase/server.ts',
    'src/app/api/auth/callback/route.ts',
    'src/app/api/auth/logout/route.ts',
    'src/middleware.ts',
    'src/frontend/hooks/useAuth.ts',
    'src/app/auth/login/page.tsx',
    'src/app/auth/signup/page.tsx'
];

requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} is missing`);
        hasErrors = true;
    }
});

// Check package.json for required dependencies
console.log('\n📦 Checking dependencies...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredDeps = ['@supabase/ssr', '@supabase/supabase-js', 'next'];
    requiredDeps.forEach(dep => {
        if (deps[dep]) {
            console.log(`✅ ${dep} (${deps[dep]})`);
        } else {
            console.log(`❌ ${dep} is missing - run: npm install ${dep}`);
            hasErrors = true;
        }
    });
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ Setup incomplete. Please fix the issues above.');
    console.log('\n📖 See SETUP.md for detailed instructions.');
    process.exit(1);
} else {
    console.log('✅ Setup looks good!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Configure OAuth providers in Supabase Dashboard (optional)');
    console.log('   2. Run: npm run dev');
    console.log('   3. Test authentication at: http://localhost:3000/auth/login');
    process.exit(0);
}

