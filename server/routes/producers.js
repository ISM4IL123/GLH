import express from "express";
import { readDB, writeDB } from "../db.js";

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
    console.log("Producer route test endpoint hit");
    res.json({ success: true, message: "Producer routes are working" });
});

// Apply to be a producer
router.post("/apply", async (req, res) => {
    try {
        const { userId, businessName, businessType, description } = req.body;
        console.log("Producer apply request:", { userId, businessName, businessType, description });

        if (!userId || !businessName || !businessType || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        const db = readDB();

        // Initialize applications array if it doesn't exist
        if (!db.applications) {
            db.applications = [];
        }

        // Check if user already has a pending application
        const existingApp = db.applications.find(
            app => app.userId === userId && app.status === "pending"
        );

        if (existingApp) {
            return res.status(400).json({ 
                success: false, 
                message: "You already have a pending application" 
            });
        }

        const application = {
            _id: Date.now().toString(),
            userId,
            businessName,
            businessType,
            description,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        db.applications.push(application);
        writeDB(db);

        console.log(`✅ Producer application submitted: ${businessName} (${userId})`);
        res.status(201).json({
            success: true,
            message: "Application submitted successfully"
        });

    } catch (err) {
        console.error("❌ Producer application error:", err);
        res.status(500).json({ 
            success: false, 
            message: `Server error: ${err.message}` 
        });
    }
});

// Get all applications (admin only)
router.get("/applications", async (req, res) => {
    try {
        const db = readDB();
        const applications = db.applications || [];

        res.status(200).json({
            success: true,
            applications
        });
    } catch (err) {
        console.error("Error fetching applications:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});

// Update application status (admin only)
router.post("/update-status", async (req, res) => {
    try {
        const { applicationId, status } = req.body;

        if (!applicationId || !status) {
            return res.status(400).json({ 
                success: false, 
                message: "Application ID and status required" 
            });
        }

        if (!["approved", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status" 
            });
        }

        const db = readDB();
        const application = db.applications?.find(app => app._id === applicationId);

        if (!application) {
            return res.status(404).json({ 
                success: false, 
                message: "Application not found" 
            });
        }

        application.status = status;
        application.updatedAt = new Date().toISOString();

        // If approved, mark user as producer
        if (status === "approved") {
            const user = db.users.find(u => u._id === application.userId);
            if (user) {
                user.isProducer = true;
                user.businessName = application.businessName;
                user.businessType = application.businessType;
            }
        }

        writeDB(db);

        console.log(`✅ Application ${applicationId} updated to ${status}`);
        res.status(200).json({
            success: true,
            message: "Application updated successfully"
        });

    } catch (err) {
        console.error("Error updating application:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});

// Add product by producer
router.post("/add-product", async (req, res) => {
    try {
        const { name, price, stock, category, description } = req.body;

        if (!name || !price || !stock || !category || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields required" 
            });
        }

        const db = readDB();
        const newProduct = {
            id: Date.now().toString(),
            name,
            price,
            stock,
            category,
            description,
            createdAt: new Date().toISOString()
        };

        if (!db.products) db.products = [];
        db.products.push(newProduct);
        writeDB(db);

        console.log(`✅ Product added: ${name}`);
        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });

    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});

// Get producer's products
router.get("/my-products", async (req, res) => {
    try {
        const db = readDB();
        const products = db.products || [];

        res.status(200).json({
            success: true,
            products
        });

    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});

// Delete product
router.delete("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        const db = readDB();
        const productIndex = db.products?.findIndex(p => p.id === productId);

        if (productIndex === -1 || productIndex === undefined) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        db.products.splice(productIndex, 1);
        writeDB(db);

        console.log(`✅ Product deleted: ${productId}`);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});

// Update product (stock and description)
router.put("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const { stock, description } = req.body;

        if (stock === undefined || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "Stock and description required" 
            });
        }

        const db = readDB();
        const product = db.products?.find(p => p.id === productId);

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        product.stock = parseInt(stock);
        product.description = description;
        product.updatedAt = new Date().toISOString();

        writeDB(db);

        console.log(`✅ Product updated: ${productId}`);
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});

// Checkout - reduce stock for purchased items
router.post("/checkout", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Items array required" 
            });
        }

        const db = readDB();

        // Validate all items exist and have sufficient stock before making changes
        for (const item of items) {
            if (!item.id || !item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Each item must have id and quantity" 
                });
            }

            const product = db.products?.find(p => p.id === item.id);

            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Product ${item.id} not found` 
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
                });
            }
        }

        // All items valid, now reduce stock
        const updatedItems = [];
        for (const item of items) {
            const product = db.products.find(p => p.id === item.id);
            product.stock -= item.quantity;
            updatedItems.push({
                id: product.id,
                name: product.name,
                stock: product.stock,
                quantity: item.quantity
            });
            console.log(`📦 ${product.name} stock reduced by ${item.quantity} (now: ${product.stock})`);
        }

        writeDB(db);

        console.log(`✅ Checkout completed - ${items.length} items purchased`);
        res.status(200).json({
            success: true,
            message: "Checkout successful",
            updatedProducts: updatedItems
        });

    } catch (err) {
        console.error("❌ Error during checkout:", err.message);
        res.status(500).json({ 
            success: false, 
            message: `Server error: ${err.message}` 
        });
    }
});

export default router;
