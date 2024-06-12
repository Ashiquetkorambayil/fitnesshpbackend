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
const pendingOrdersController = require('../Controller/pendingOrderController')
const paytmController = require('../Controller/paytmController')
const paytmCheckoutController = require('../Controller/paytmCheckoutController')
const razorpayController = require('../Controller/razorpayController')


// admin -----------------------------

// router.post('/postadmin',adminController.postadmin);
router.post('/postsignin',adminController.postsignin);
router.get('/getadmin',verifyToken,adminController.getAdmin);
router.get('/getadminbyid/:id',verifyToken,adminController.getAdminById);
router.put('/updateadminbyid/:id',upload.single('image'),verifyToken,adminController.editAdmin);

// plans------

router.post('/postPlan',verifyToken,planController.postPlan)
router.get('/getplans',planController.getPlans)
router.get('/getplansbyid/:id',verifyToken,planController.getPlansById)
router.put('/putplans/:id',verifyToken,planController.putPlans)
router.delete('/deleteplan/:id',verifyToken,planController.deletePlansById)

// enrollment------

// router.post('/postenrollment',enrollmetnController.postEnrollment)
router.get('/getenrollment',verifyToken,enrollmetnController.getEnrollment)
router.get('/getenrollmentbyid/:id',enrollmetnController.getEnrollmentById)
router.put('/putenrollment/:id',enrollmetnController.putEnrollment)

// users-----------------
router.post('/postuser', upload.fields([{ name: 'image', maxCount: 1 },{ name: 'idproof', maxCount: 1 }]),userController.postUser)
router.post('/createuser',upload.single('image'),userController.createUser)
router.post('/postusersignin',userController.userPostSignIn)
router.get('/getusers',verifyToken,userController.getUser)
// router.get('/getsearchusers',verifyToken,userController.getSearchUsers)
router.get('/getuserbyid/:id',userController.getUserById)
router.delete('/deleteuser/:id',userController.deleteUser)
router.put('/edituser/:id',upload.fields([{ name: 'image', maxCount: 1 },{ name: 'idproof', maxCount: 1 }]),userController.editUser)
router.put('/revealuser/:id',verifyToken,userController.revealUser)
router.get('/getrevealedusers',verifyToken,userController.getrevealedUser)
router.put('/unreveal/:id',verifyToken,userController.unrevealUser)
router.post('/onlineuser', upload.fields([{ name: 'image', maxCount: 1 },{ name: 'idproof', maxCount: 1 }]),userController.onlineUser)
router.put('/changepassword/:id',userController.changepassword);
// plan orders ----------------

router.post('/createplanorder',verifyToken,planOrderController.postPlandOrder)
router.get('/getplanhistorybyuser/:id',planOrderController.getPlanOrderByUser)
router.get('/getlastplanorder/:id',verifyToken,planOrderController.getLastPlanOrderOfUser)
router.get('/getfeedetailbyuser/:id',verifyToken,planOrderController.getPlanDetailsById)
router.get('/getlastplansofallusers',planOrderController.getLastPlanOrderOfAllUsers)
router.delete('/deleteplanorder/:id',verifyToken,planOrderController.deletePlanOrder)

router.post('/creatependingorder',verifyToken,planOrderController.postPendingOrder)
router.get('/getpendingorder',verifyToken,planOrderController.getPendingPlanOrders)
router.put('/updatetoactive/:id',verifyToken,planOrderController.updateOrderToActive)
router.put('/updatetoreject/:id',verifyToken,planOrderController.updateOrderToRejected)
router.get('/getallstatus',verifyToken,planOrderController.getAllStatus)
router.get('/getactiveusers',verifyToken,planOrderController.getActiveStatus)
// pending orders ----------------


router.post('/handlePayNow',paytmController.initiateTransaction);
router.post('/paynow',paytmCheckoutController.paytmPayment)

// razorpay-----

router.post('/pay',razorpayController.order)
router.post('/validate',razorpayController.validate)
// router.post('/creatependingorder',verifyToken,pendingOrdersController.postPendingOrder)
// router.get('/getpendingorder',verifyToken,pendingOrdersController.getPendingOrder)
// router.post('/updatependingorderstatus',verifyToken,pendingOrdersController.updatePendingOrderStatus)


module.exports = router;