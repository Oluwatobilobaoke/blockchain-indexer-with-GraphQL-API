echo '----Building source file---'
npx tsc

echo '----Copying folders----'
mkdir -p dist/views
mkdir -p dist/migrations

echo '----Copying static files----'
cp -r src/views dist/

echo '----Completed----'