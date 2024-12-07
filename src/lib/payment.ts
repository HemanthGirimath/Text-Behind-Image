import { UserPlan } from './utils'

export async function handlePaymentSuccess(response: any, plan: UserPlan) {
  try {
    const res = await fetch('/api/subscription/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan,
        paymentId: response.razorpay_payment_id,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to update subscription')
    }

    return data
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}
