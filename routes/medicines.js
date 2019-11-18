const express = require('express');

const { createMedicine, updateMedicine,
        getMedicines, getMedicine,
        deleteMedicine, updateMedicineStock} = require('../controllers/medicines');
const {protect,authorize} = require('../middleware/auth');


const router = express.Router();

router.post('/',protect, createMedicine);

router.put('/:id',protect, updateMedicine);

router.get('/',getMedicines);

router.get('/:id',getMedicine);

router.delete('/:id', protect, deleteMedicine);

router.put('/updateStock/:id',protect, updateMedicineStock);

// router.get('/me', protect,getMe);



module.exports = router;