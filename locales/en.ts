// locales/en.ts
// locales/en.ts
export default {
    hello: 'Hello',
    login: {
        title: "Login",
        email: "Email Address",
        password: "Password",
        submit: "Login",
        loading: "Logging in...",
        error: "Invalid email or password.",
        continueWith: "Or continue with",
        noAccount: "Don't have an account? Sign up",
        google: "Google"
    },
    register: {
        title: "Register",
        username: "Username",
        email: "Email Address",
        password: "Password",
        confirmPassword: "Confirm Password",
        submit: "Sign Up",
        loading: "Signing up...",
        error: "An error occurred during registration.",
        success: "Registration successful! You can now log in.",
        alreadyRegistered: "Already registered? Log in"
    },
    profile: {
        title: "My Profile",
        loading: "Loading...",
        pleaseLogin: "Please log in to view your profile.",
        loginButton: "Login",
        username: "Username",
        email: "Email Address",
        address: "Address",
        city: "City",
        state: "State",
        country: "Country",
        postalCode: "Postal Code",
        signOut: "Sign Out",
        myInfo: "My Information",
    },
    detail: {
        backToList: "Back to list",
        lastBid: "Last Bid",
        bid: "Bid",
        reservePrice: "Reserve Price",
        from: "From",
        to: "to",
        rules: "RULES",
        rulesList: [
            "Auction Extension: For every new bid within the last 5 minutes, a 5-minute countdown is reset. The auction is definitively closed once this period has passed without a new bid.",
            "Minimum Bids After Extended Time: If the auction exceeds 30 minutes after the announced end time, the minimum increment increases to 50 USD.",
            "Automatic Bidding: Participants can set a maximum amount from the start. The system automatically bids with their chosen increment (e.g., +10€) up to the defined limit.",
            "Registration: A simple form allows for registration by verifying the participants' authenticity: Name, First Name, City/Country, Email and phone (not publicly visible).",
            "Auction Calendar: A calendar of upcoming auctions is available. Participants can enable email notifications to be informed of future sales.",
            "Commitment: By confirming a bid, the participant commits to making the payment if they win."
        ],
        buy: "Buy",
        safely: "Safely",
        buyDescription: [
            "Feel confident buying through our marketplace. Sellers are paid once you confirm the receipt of your orders.",
            "All payments are made by bank transfer. Instructions will be provided immediately after the end of the auction. You then have 2 business days to make the payment. VAT, if applicable, is due on all orders."
        ],
        description: "DESCRIPTION",
        howItWorks: "How it works",
        howItWorksSteps: [
            "Bid and win an offer",
            "Bid validation by the seller",
            "Pay by transfer within 48h",
            "Collect or have your lot delivered",
            "Check your order upon receipt"
        ],
    },
    admin: {
        title: "Admin Panel",
        createAuction: "Create Auction",
        name: "Auction Name",
        description: "Description",
        endDate: "End Date",
        startingPrice: "Starting Price",
        addImage: "Add Image (optional)",
        error: "An error occurred.",
        create: "Create Auction",
        viewAuctions: "View Auctions",
        loading: "Loading...",
        fetchError: "Server connection error.",
    },
    nav: {
        home: "Home",
        profile: "Profile",
        login: "Login",
        register: "Register",
        admin: "Admin Panel",
        logout: "Logout"
    },
    home: {
        welcome: "Welcome to our site!",
        description: "This is an example Next.js app with language management.",
        features: "Features",
        feature1: "Translations managed with next-international",
        feature2: "Client-side routing with Next.js",
        feature3: "Styling with Tailwind CSS"
    },
    common: {
        loading: "Loading...",
        error: "An error occurred",
        success: "Success",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        back: "Back"
    }
} as const;
