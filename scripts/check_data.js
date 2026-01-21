
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim();
    }
    return acc;
}, {});

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJobs() {
    console.log('Checking jobs table...');

    // 1. Total count
    const { count, error: countError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error fetching count:', countError);
        return;
    }
    console.log(`Total jobs in DB: ${count}`);

    if (count === 0) {
        console.log('No jobs found. Import script might have failed.');
        return;
    }

    // 2. Group by status
    const { data: statusData, error: statusError } = await supabase
        .from('jobs')
        .select('status');

    if (statusError) {
        console.error('Error fetching status:', statusError);
        return;
    }

    const statusCounts = statusData.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
    }, {});

    console.log('Jobs by status:', statusCounts);

    // 2.5 Group by Role
    const { data: roleData, error: roleError } = await supabase
        .from('jobs')
        .select('role_id, roles(name)');

    // Check actual roles metadata
    const { data: allRoles } = await supabase.from('roles').select('name, slug');
    console.log('All Roles in DB:', allRoles);

    if (!roleError) {
        const roleCounts = roleData.reduce((acc, job) => {
            const rName = job.roles?.name || 'Unknown';
            acc[rName] = (acc[rName] || 0) + 1;
            return acc;
        }, {});
        console.log('Jobs by Role:', roleCounts);
    }

    // 4. Other tables counts
    const tables = ['skills', 'job_skills', 'locations', 'roles'];
    for (const table of tables) {
        const { count: tCount, error: tError } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
        if (!tError) {
            console.log(`Total ${table}: ${tCount}`);
        }
    }


    // 3. Sample Job
    const { data: sample, error: sampleError } = await supabase
        .from('jobs')
        .select('id, job_code, title, status')
        .limit(5);

    if (sampleError) {
        console.error('Error fetching sample job:', sampleError);
    } else {
        console.log('Sample jobs:', sample);
    }
}

checkJobs();
