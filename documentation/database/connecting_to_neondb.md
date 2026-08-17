1. Log into neonDB, click on the green CONNECT button on the top left. It should show you what to put into your .env file - paste it. 
NOTE: THE PREFIX SHOULD BE ```postgres://....```, because dbmate doesn't recognize ```postgresql://....```

2. test_db.ts gives an example function for how to connect to neonDB. 

3. To run test_db.ts, edit package.json and include the following in the scripts section:
```"test:db": "tsx src/test_db.ts"```

4. In a terminal, run the following:
```npm run test:db```

5. You can go to the neonDB website and click on "monitoring" on the side bar. Click on Query Performance. You should see the query