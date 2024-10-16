enum accessibilityId {
  cart = '~test-Cart',
  toggle = '~test-Toggle',
}

export async function clickToggle() {
  await browser.$(accessibilityId.toggle).click();
}

export async function selectItem(itemPosition: string) {
  await browser.$(`(//android.widget.TextView[@text="+"])[${itemPosition}]`).click();
}

export async function goToShoppingCart() {
  await browser.$(accessibilityId.cart).click();
}

export async function selectRandomItems(itemRandomItems: number) {
  for (let i = 1; i <= itemRandomItems; i++) {
    await selectItem('1');
  }
}
