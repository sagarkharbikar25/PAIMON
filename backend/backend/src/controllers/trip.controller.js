const Trip = require('../models/trip.model');
const User = require('../models/user.model');
const { AppError } = require('../middleware/error.middleware');

const getTrips = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {
      $or: [{ createdBy: req.user._id }, { 'members.user': req.user._id, 'members.status': 'accepted' }],
    };
    if (status) query.status = status;
    const trips = await Trip.find(query)
      .populate('createdBy', 'name email photoUrl')
      .populate('members.user', 'name email photoUrl')
      .sort({ startDate: -1 });
    res.json({ success: true, count: trips.length, trips });
  } catch (err) { next(err); }
};

const getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('createdBy', 'name email photoUrl')
      .populate('members.user', 'name email photoUrl');
    if (!trip) return next(new AppError('Trip not found', 404));
    res.json({ success: true, trip });
  } catch (err) { next(err); }
};

const createTrip = async (req, res, next) => {
  try {
    const trip = await Trip.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, trip });
  } catch (err) { next(err); }
};

const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!trip) return next(new AppError('Not found or unauthorized', 404));
    Object.assign(trip, req.body);
    await trip.save();
    res.json({ success: true, trip });
  } catch (err) { next(err); }
};

const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!trip) return next(new AppError('Not found or unauthorized', 404));
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) { next(err); }
};

const inviteMember = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!trip) return next(new AppError('Not found or unauthorized', 404));
    const invitee = await User.findOne({ email: req.body.email });
    if (!invitee) return next(new AppError('User not found', 404));
    if (trip.members.some(m => m.user.equals(invitee._id)))
      return next(new AppError('Already invited', 400));
    trip.members.push({ user: invitee._id });
    await trip.save();
    res.json({ success: true, message: `Invite sent to ${req.body.email}` });
  } catch (err) { next(err); }
};

const respondToInvite = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(new AppError('Trip not found', 404));
    const entry = trip.members.find(m => m.user.equals(req.user._id));
    if (!entry) return next(new AppError('No invite found', 404));
    entry.status = req.body.action === 'accept' ? 'accepted' : 'declined';
    await trip.save();
    res.json({ success: true, message: `Invite ${entry.status}` });
  } catch (err) { next(err); }
};

module.exports = { getTrips, getTrip, createTrip, updateTrip, deleteTrip, inviteMember, respondToInvite };