exports.markPaid = async (req, res) => {
  try {
    const shopId = req.user.id;

    await pool.query(
      'UPDATE shops SET subscription_status = $1 WHERE id = $2',
      ['active', shopId]
    );

    res.json({ msg: 'Subscription status set to active.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update subscription status' });
  }
};
