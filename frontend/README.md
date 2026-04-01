to start the program you open termenal and cd into server and run "npm start" then cd into frontend and enter "npm run dev" and open the link

there are 4 premade logins 1 basic user 3 producers and 1 admin:

basic user: 
    email:user@user.com
    Password:User1234

first producer:
    email:producer@producer.com
    password:Producer123

second producer:
    email:producer1@producer.com
    password:Producer123

third producer:
    email:producer2@producer.com
    password:Producer123

admin:
    email:Admin@admin.com
    password:Admin123

## Adding Product Images

1. **Replace placeholders**: Go to `src/assets/images/` - replace files like `1001-organic-apples.jsx` with your `1001-organic-apples.png` (same name).

2. **For new products**: When adding via ProducerDashboard, set `image` field to kebab-case name (e.g., "fresh-milk").

3. **Restart dev server**: `cd frontend && npm run dev` (hot reload may not pick up new images).

4. **Image format**: PNG recommended, square/crop to 400x400px for best display.

5. **Existing products**: Edit `server/users.json` manually: add `"image": "1001-organic-apples"` to products array.

Images now display in HomePage (grid), DetailsPage (large), ProducerDashboard (thumbnail). Placeholders use React logo - replace with your PNGs!

