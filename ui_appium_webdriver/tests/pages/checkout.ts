// ASSERTSIONS //
export async function ValidateItemInCart(title: string, price: string) {
  const nameResult = await browser.$(`//android.widget.TextView[@text="${title}"]`);
  await expect(nameResult).toHaveText(title);

  const priceResult = await browser.$(`//android.widget.TextView[@text="${price}"]`);
  await expect(priceResult).toHaveText(price);
}

export async function ValidateTotalCart(itemTotal: string) {
  const results = await browser.$(`//android.widget.TextView[@text="${itemTotal}"][1]`);
  await expect(results).toHaveText(itemTotal);
}
