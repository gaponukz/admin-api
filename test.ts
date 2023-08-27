import { Client } from 'ts-postgres'

async function main() {
    const client = new Client();
    await client.connect();

    try {
        const result = client.query(
            "SELECT 'Hello ' || $1 || '!' AS message",
            ['world']
        );

        for await (const row of result) {
            // 'Hello world!'
            console.log(row.get('message'));
        }
    } finally {
        await client.end();
    }
}

main()