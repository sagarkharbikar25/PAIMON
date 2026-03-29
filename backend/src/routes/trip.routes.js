const router  = require('express').Router();
const { protect } = require('../middleware/auth.middleware');   // ✅ JWT, not testProtect
const {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  inviteMember,
  respondToInvite,
} = require('../controllers/trip.controller');

router.get('/',              protect, getTrips);
router.post('/',             protect, createTrip);
router.get('/:id',           protect, getTrip);
router.put('/:id',           protect, updateTrip);
router.delete('/:id',        protect, deleteTrip);
router.post('/:id/invite',   protect, inviteMember);
router.patch('/:id/respond', protect, respondToInvite);

module.exports = router;
console.log({
  protect,
  getTrips
});