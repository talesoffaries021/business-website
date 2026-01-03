# 🚀 QUICK START GUIDE - Tales of Fairies Website

## ⚡ 5-Minute Setup

### Step 1: Update Your WhatsApp Number (2 minutes)
1. Open `js/script.js`
2. Find line 228: `const phoneNumber = '923001234567';`
3. Replace with YOUR WhatsApp number (country code + number, no + or spaces)
   Example: `923001234567` for +92 300 1234567

### Step 2: Add Your Products (1 minute per product)
1. Open `js/script.js`
2. Find the `sampleProducts` array (starts at line 11)
3. Copy this template and fill in your details:

```javascript
{
    id: 7,  // Make this unique for each product
    name: "Your Product Name",
    price: 250,  // Price in PKR
    category: "resin-keychains",  // or "acrylic-keychains", "crochet", "bookmarks"
    type: "premade",  // or "custom"
    image: "images/your-photo.jpg",
    description: "Write a short, appealing description"
}
```

### Step 3: Add Product Photos (30 seconds each)
1. Place your photos in the `images` folder
2. Make sure the filenames match what you wrote in Step 2

### Step 4: Update Contact Info (2 minutes)

**In ALL HTML files**, replace:
- `talesoffairies@example.com` → Your email
- `+92 300 1234567` → Your phone number (with +)
- `https://instagram.com` → Your Instagram URL

**Easiest way:** Use Find & Replace in your text editor!

### Step 5: Update Bank Details (1 minute)
1. Open `checkout.html`
2. Find line ~143 (Bank Transfer Details section)
3. Replace with your actual bank information

## ✅ You're Ready!

Just open `index.html` in your browser and test everything:

**Testing Checklist:**
- [ ] Click all navigation links
- [ ] Add products to cart
- [ ] Test custom order form
- [ ] View cart and update quantities
- [ ] Go through checkout process
- [ ] Test WhatsApp button
- [ ] Check on mobile phone

## 🎨 Optional Customizations

### Change Shop Name
Find & Replace "Tales of Fairies" with your shop name in all HTML files

### Change Colors
Edit `css/style.css` - Look for the `:root` section at the top

### Add More Categories
1. Add new category button in `shop.html`
2. Create products with that category in `js/script.js`

## 📱 Publishing Your Website

### Free Option - Netlify:
1. Go to netlify.com
2. Sign up (free)
3. Drag and drop your entire website folder
4. Done! You get a free URL

### Free Option - GitHub Pages:
1. Create GitHub account
2. Create new repository
3. Upload all files
4. Enable Pages in Settings
5. Your site is live!

## 🆘 Common Issues

**Products not showing?**
→ Check `js/script.js` for syntax errors (missing commas, brackets)

**Images broken?**
→ Make sure image filenames match EXACTLY (case-sensitive!)

**Cart not working?**
→ Enable cookies/localStorage in browser settings

**WhatsApp not opening?**
→ Check phone number format (no + in the code, just numbers)

## 💡 Pro Tips

1. **Start Small**: Add 5-10 products first, then expand
2. **Good Photos**: Invest time in taking clear, bright product photos
3. **Test Mobile**: Most customers shop on phones!
4. **Quick Replies**: Set up WhatsApp business for faster responses
5. **Update Regularly**: Add new products weekly to keep shop fresh

## 📞 Your Setup Checklist

- [ ] Updated WhatsApp number in script.js
- [ ] Added my products to script.js
- [ ] Added product photos to images folder
- [ ] Updated email address everywhere
- [ ] Updated Instagram link
- [ ] Updated bank transfer details
- [ ] Tested website thoroughly
- [ ] Checked on mobile phone
- [ ] Ready to go live! 🚀

---

**Time Investment:** ~20-30 minutes for complete setup

**Remember:** You can always edit and add more products later. Start simple and grow!

## 🌟 Next Steps After Launch

1. Share website link on Instagram stories
2. Add link to WhatsApp status
3. Tell friends and family
4. Join local buy/sell groups
5. Consider Facebook page
6. Engage with customers quickly
7. Ask satisfied customers for reviews

Good luck with your Tales of Fairies shop! 🧚‍♀️✨💕
