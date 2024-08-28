const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken')


var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        // Preserve the file extension
        const fileExtension = file.originalname.split('.').pop();
        // Generate a unique filename
        const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + fileExtension;
        cb(null, uniqueFilename);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
        }
    }
});




const planController = require('../Controller/planController');
const enrollmetnController = require('../Controller/enrollmentController')
const userController = require('../Controller/userController')
const adminController = require('../Controller/adminController')
const planOrderController = require('../Controller/planOrderController')
const paytmController = require('../Controller/paytmController')
const paytmCheckoutController = require('../Controller/paytmCheckoutController')
const razorpayController = require('../Controller/razorpayController')
const optionsController = require('../Controller/optionsController');
const campaignController = require('../Controller/campaignController')
const notificationController = require('../Controller/notificationController')
const subCategoryController = require('../Controller/subCategoryController')
const staffController = require('../Controller/staffController')
const notification = require('../Controller/firebaseNotification')


// admin -----------------------------

router.post('/postadmin',adminController.postadmin);
router.post('/postsignin',adminController.postsignin);
router.get('/getadmin',verifyToken,adminController.getAdmin);
router.get('/getadminbyid/:id',verifyToken,adminController.getAdminById);
router.put('/updateadminbyid/:id',upload.single('image'),verifyToken,adminController.editAdmin);
router.put('/adminchangepassword/:id',verifyToken,adminController.adminChangepassword);

// plans------

router.post('/postPlan',verifyToken,planController.postPlan)
router.get('/getplans',planController.getPlans)
router.get('/getplansbyid/:id',verifyToken,planController.getPlansById)
router.get('/getplansbyoptiosid/:id',verifyToken,planController.getPlansByOptions)
router.put('/putplans/:id',verifyToken,planController.putPlans)
router.delete('/deleteplan/:id',verifyToken,planController.deletePlansById)

// enrollment------

// router.post('/postenrollment',enrollmetnController.postEnrollment)
router.get('/getenrollment',verifyToken,enrollmetnController.getEnrollment)
router.get('/getenrollmentbyid/:id',enrollmetnController.getEnrollmentById)
router.put('/putenrollment/:id',enrollmetnController.putEnrollment)

// users-----------------
// For forgot password request
router.post('/forgotpassword', userController.forgotPassword);

// For password reset using token
router.post('/resetpassword/:token', userController.resetPassword);

router.post('/postuser', verifyToken,upload.fields([{ name: 'image', maxCount: 1 },{ name: 'idProof', maxCount: 1 }]),userController.postUser);
router.post('/createuser',upload.single('image'),userController.createUser);
router.post('/postusersignin',userController.userPostSignIn);
router.get('/getusers',verifyToken,userController.getUser);
router.get('/getallusers',verifyToken,userController.getAllUsers);
router.get('/getallusersreport',verifyToken,userController.getAllUsersReport);
// router.get('/getsearchusers',verifyToken,userController.getSearchUsers)
router.get('/getuserbyid/:id',userController.getUserById);
router.delete('/deleteuser/:id',userController.deleteUser)
router.put('/edituser/:id',upload.fields([{ name: 'image', maxCount: 1 },{ name: 'idproof', maxCount: 1 }]),userController.editUser);
router.put('/revealuser/:id',verifyToken,userController.revealUser);
router.get('/getrevealedusers',verifyToken,userController.getrevealedUser);
router.put('/unreveal/:id',verifyToken,userController.unrevealUser);
router.post('/onlineuser', upload.fields([{ name: 'image', maxCount: 1 },{ name: 'idproof', maxCount: 1 }]),userController.onlineUser);
router.put('/changepassword/:id',verifyToken,userController.changepassword);
router.get('/getuserbyphone/:phone',verifyToken,userController.getUserByPhone);
// plan orders ----------------

router.post('/createplanorder',verifyToken,planOrderController.postPlandOrder)
router.get('/getplanhistorybyuser/:id',planOrderController.getPlanOrderByUser)
router.get('/getplanorders',verifyToken,planOrderController.getPlanOrders)
router.get('/monthlyreport',verifyToken,planOrderController.monthlyReport)
router.get('/getlastplanorder/:id',verifyToken,planOrderController.getLastPlanOrderOfUser)
router.get('/getfeedetailbyuser/:id',verifyToken,planOrderController.getPlanDetailsById)
router.get('/getlastplansofallusers',planOrderController.getLastPlanOrderOfAllUsers)
router.delete('/deleteplanorder/:id',verifyToken,planOrderController.deletePlanOrder)
router.post('/creatependingorder',verifyToken,planOrderController.postPendingOrder)
router.get('/getpendingorder',verifyToken,planOrderController.getPendingPlanOrders)
router.get('/getpendingbuddyorders',verifyToken,planOrderController.getBuddyPending)
router.put('/updatetoactive/:id',verifyToken,planOrderController.updateOrderToActive)
router.put('/updatebuddyplan/:id',verifyToken,planOrderController.updateBuddyPlan)
router.put('/updatetoreject/:id',verifyToken,planOrderController.updateOrderToRejected)
router.put('/buddytoactivate/:id',verifyToken,planOrderController.buddyToActiveBuddy)
router.get('/getallstatus',verifyToken,planOrderController.getAllStatus)
router.get('/getactiveusers',verifyToken,planOrderController.getActiveStatus)
router.put('/updatependingamount/:id',verifyToken,planOrderController.updatePendingorderAmt)
router.put('/updatependingdate/:id',verifyToken,planOrderController.updatePendingorderDate)
router.put('/updatependingduration/:id',verifyToken,planOrderController.updateOrderDurationAndExpiry)
router.put('/pauseplan/:id',verifyToken,planOrderController.pausePlan)
router.put('/unpauseplan/:id',verifyToken,planOrderController.unpausePlan)


router.post('/createbuddyplan',verifyToken,planOrderController.createBuddyPlan)
router.post('/spreadplan',verifyToken,planOrderController.spreadPlanForBuddy)

// options ----------------
router.post('/postoptions',verifyToken,optionsController.postOptions);
router.get('/getoptions',verifyToken,optionsController.getOptions);
router.get('/getoptionsbyid/:id',verifyToken,optionsController.getOptionsById);
router.put('/updateoptions/:id',verifyToken,optionsController.editOptions);
router.delete('/deleteoptions/:id',verifyToken,optionsController.deleteOptionsByid);

// notification--------------------

// router.post('/createnotification',verifyToken,upload.single('image'),notificationController.createNotification)
router.get('/getallnotification',verifyToken,notificationController.getAllNotifications);
router.delete('/deletenotification/:id',verifyToken,notificationController.deleteNotification);
// campaign--------------------
router.post('/createcampaign',verifyToken,campaignController.createCampaign)
router.get('/getcampaign',verifyToken,campaignController.getCampaign)
router.get('/getcampaignbyid/:id',verifyToken,campaignController.getCampaignzById)
router.delete('/deletecampaign/:id',verifyToken,campaignController.deleteCampaign)
router.delete('/deleteexpired',verifyToken,campaignController.deleteExpiredCampaigns)
router.put('/updatecampaign/:id',verifyToken,campaignController.updateCampaign)

router.post('/handlePayNow',paytmController.initiateTransaction);
router.post('/paynow',paytmCheckoutController.paytmPayment)

// razorpay-----

router.post('/pay',razorpayController.order)
router.post('/validate',razorpayController.validate)

// sub-category------------

router.post('/postsubcategory',verifyToken,subCategoryController.createSubCategory)
router.get('/getallsubcategory',verifyToken,subCategoryController.getAllSubCategories)
router.get('/getsubcategorybyid/:id',verifyToken,subCategoryController.getSubCategoryById)
router.get('/getsubcategoriesbyid/:id',verifyToken,subCategoryController.getSubCategoriesById)
router.put('/updatesubcategory/:id',verifyToken,subCategoryController.updateSubCategory)
router.delete('/deletesubcategory/:id',verifyToken, subCategoryController.deleteSubCategory)

// staff---------------
router.post('/staffcreate', staffController.createStaff);
router.put('/staffedit/:id', staffController.editStaff);
router.delete('/staffdelet/:id', staffController.deleteStaff);
router.post('/staffsignin/signin', staffController.signInStaff);
router.get('/staffsget', staffController.getStaff);
router.get('/staffgetbyid/:id', staffController.getStaffById);

// notification --------------------
router.post('/notify',notification.Notification)


module.exports = router;