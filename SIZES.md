# Sizes — implementation plan

Per-size stock for products (sizes 1-4). Work top to bottom; each step is independently
testable. Nothing below step 4 is visible to a buyer until the webhook decrements the
right size, so test the chain by hand-editing a product doc in the Firebase console:

```
sizes: { "1": 2, "2": 0, "3": 1, "4": 0 }
```

## The data shape

`sizes` is an optional map on the product doc: size key -> units left for that size.

- Has a `sizes` map = sized product. That map is the ONLY truth for availability.
- No `sizes` map = old one-size product, uses the existing top-level `stock` field.
- Sold out for a sized product = every size is 0.

Decide and write down which convention one-size products use going forward:
`sizes: { misc: n }` (what the `ONE_SIZE` constant implies) or no `sizes` field at all
(what the current Firestore docs do). Helpers can handle both, but the admin form should
only ever write one of them.

## How the size travels

```
browser form  ->  /api/checkout_sessions  ->  Stripe session  ->  webhook  ->  order doc + email + decrement
name="size"       formData.get('size')       metadata: { size }   session.metadata.size
```

One Stripe price per product; size rides along as metadata. Chosen over one-price-per-size
because the price doesn't change with size, and per-size prices would mean four Stripe
objects per product and four more fields for Jashin to fill in.

Tradeoff accepted: `size` comes from the buyer's browser, so a sold-out size can be posted.
Same trust level as the `priceID` already accepted, so it's not new exposure. Optional
hardening in step 3.

---

## 1. `src/lib/inventory.js`

- [ ] Fix `hasSizes`. `!(ONE_SIZE in (product.sizes) ?? {})` throws a TypeError on any
      product with no `sizes` field — `in` binds tighter than `??`, so it parses as
      `(ONE_SIZE in product.sizes) ?? {}` and the `?? {}` protects nothing. Guard
      `product.sizes` before the `in`.
- [ ] Fix `inStock`. `totalStock > 0 || product.stock > 0` reports "available" for a sized
      product that's all zeros but has a stale top-level `stock`. Rule: if there's a
      `sizes` map it decides; only fall back to `stock` when there is no map.
- [ ] Add `sizeStock(product, size)` — units left in one size, 0 if missing.
- [ ] Add `productSizes(product)` — the size keys to render, filtered to what's on the
      product, always in `SIZES` order so the buttons never reshuffle.

Everything downstream reads these helpers instead of touching `product.sizes` directly.

## 2. `src/app/shop/[collection]/[slug]/page.js`

- [ ] Pass `product` whole to `ProductInfo` instead of the seven flattened props — every
      helper takes a product object, otherwise `sizes` plus derived flags get threaded by hand.
- [ ] `const [size, setSize] = useState(null)` lives in `ProductInfo`, not in the selector.
      The form needs to read it.
- [ ] `SizeSelector` component: map `productSizes(product)` to buttons,
      `disabled={!sizeInStock(...)}`, dim + strike-through the dead ones, highlight the
      selected one. `type="button"` on each or they submit the form.
- [ ] Guard in `handleSubmit`: sized product with no size picked -> `preventDefault()` +
      error, same shape as the existing shipping-country guard. `showError` is a boolean
      and now has two messages to carry, so it probably becomes an error string.
- [ ] `<input type="hidden" name="size" value={size ?? ''} />` next to the `priceID` input.
- [ ] Swap the `stock > 0` checks to `inStock(product)` or sized products show `???` forever.
- [ ] Delete `// here generate the size selector` — it sits inside JSX so it renders as
      literal text on the page right now. JSX comments need `{/* */}`.

## 3. `src/app/api/checkout_sessions/route.js`

- [ ] `const size = formData.get('size')`.
- [ ] Pass `metadata: { size }` into `stripe.checkout.sessions.create`.
- [ ] Optional hardening: the route already has `priceID`, so it can `getProductByPriceId`,
      check `sizeStock(product, size) > 0`, and return 400 before creating the session.

## 4. Webhook + Firestore

- [ ] Read `session.metadata.size` in the webhook.
- [ ] Store it on the order's line item so the admin page can show it.
- [ ] Include it in Jashin's fulfillment email — he can't pack the box without it.
- [ ] `decrementStock(priceId, quantity, size)`: when a size is passed,
      `increment(-quantity)` on `sizes.<n>` instead of the top-level `stock`.

Known and accepted for now: `decrementStock` reads then writes, so two simultaneous
checkouts of the last unit both pass and stock can go to -1. `increment` is atomic so
nothing corrupts, the count just goes negative. Not worth fixing yet.

## 5. `src/app/shop/[collection]/page.js`

- [ ] Read-only size chips on the card: `<span>`s, dimmed + struck-through at 0 stock, with
      `pointer-events-none` so clicks fall through to the card's `onClick`.
- [ ] `data.sort((a, b) => b.stock - a.stock)` sorts sized products to the bottom —
      their `stock` is undefined and `undefined - undefined` is `NaN`. Sort on `totalStock`.

## 6. `src/app/admin/page.js`

- [ ] Four per-size stock inputs on the add-product form (optional — blank = one-size).
- [ ] The stock +/- controls need to be per size for sized products.
