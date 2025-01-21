#!/bin/sh

echo "Waiting for the app to be ready..."
until curl -s $TEST_URL/ready > /dev/null; do
    echo "Waiting for $TEST_URL/ready..."
    sleep 2
done

echo "Running tests against $TEST_URL..."
npm test
