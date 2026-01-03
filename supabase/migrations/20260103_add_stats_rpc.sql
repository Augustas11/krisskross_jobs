-- Function to add earnings only to stats (not available balance)
-- Used when funds are automatically routed via Stripe transfer_data
CREATE OR REPLACE FUNCTION add_creator_earnings_only_stats(
  creator_id_arg uuid,
  amount decimal
) RETURNS void AS $$
BEGIN
  INSERT INTO creator_earnings (creator_id, total_earned, available_balance)
  VALUES (creator_id_arg, amount, 0)
  ON CONFLICT (creator_id) DO UPDATE
  SET 
    total_earned = creator_earnings.total_earned + amount,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
