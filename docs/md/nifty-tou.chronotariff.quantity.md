<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nifty-tou](./nifty-tou.md) &gt; [ChronoTariff](./nifty-tou.chronotariff.md) &gt; [quantity](./nifty-tou.chronotariff.quantity.md)

## ChronoTariff.quantity() method

Calcualte the count of units between two dates.

The cost of this tariff can be calculated by multiplying the `rate` by the result of this method, for example:

```ts
const tariff = new ChronoTariff(ChronoTariffUnit.DAYS, 10);
tariff.rate * tariff.quantity(
    new Date('2024-01-01T00:00:00Z'),
    new Date('2024-01-08T00:00:00Z'),
    true) === 70; // 7 days @ 10/day
```

**Signature:**

```typescript
quantity(from: Date, to: Date, utc?: boolean): number;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  from | Date | the starting date |
|  to | Date | the ending date (exclusive) |
|  utc | boolean | _(Optional)_ if <code>true</code> then use UTC date components, otherwise assume the local time zone |

**Returns:**

number

the count of units between `from` and `to`<!-- -->, including any fractional component
