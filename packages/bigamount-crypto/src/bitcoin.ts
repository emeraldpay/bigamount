import {BigAmount, Unit, Units, NumberAmount, CreateAmount, FormatterBuilder, Predicates} from "@emeraldpay/bigamount";
import BigNumber from "bignumber.js";

export const SATOSHIS = new Units(
    [
        new Unit(0, "Satoshi", "sat"),
        new Unit(1, "Finney", "finney"),
        new Unit(2, "bit", "μBTC"),
        new Unit(5, "millibit", "mBTC"),
        new Unit(8, "Bitcoin", "BTC"),
    ]
);

export class SatoshiAny extends BigAmount {
    constructor(value: NumberAmount | BigAmount, units: Units) {
        super(value, units);
    }

    static is(value: unknown): value is SatoshiAny {
        return BigAmount.is(value) && typeof value['toBitcoin'] === "function";
    }

    toBitcoin(): number {
        return this.number.dividedBy(this.units.top.multiplier).toNumber()
    }

    protected copyWith(value: BigNumber): this {
        return new SatoshiAny(value, this.units) as this;
    }
}

export class Satoshi extends SatoshiAny {
    static ZERO: Satoshi = new Satoshi(0);

    constructor(value: NumberAmount | BigAmount, unit?: string | Unit) {
        if (typeof unit !== "undefined") {
            if (BigAmount.is(value)) {
                throw new Error("Already BigAmount");
            }
            return BigAmount.createFor(value, SATOSHIS, Satoshi.factory(), unit)
        }
        super(value, SATOSHIS);
    }

    static factory(): CreateAmount<Satoshi> {
        return (value) => new Satoshi(value)
    }

    static is(value: any): value is Satoshi {
        return BigAmount.is(value) && SATOSHIS.equals(value.units) && typeof value['toBitcoin'] === "function";
    }

    static fromBitcoin(value: NumberAmount): Satoshi {
        return new Satoshi(value, "BITCOIN")
    }

    static decode(value: string): Satoshi {
        return BigAmount.decodeFor(value, SATOSHIS, (n) => new Satoshi(n));
    }

    protected copyWith(value: BigNumber): this {
        return new Satoshi(value) as this;
    }
}

export const BitcoinFormatter = new FormatterBuilder()
    .when(Predicates.ZERO, (a, b) => {
        a.useTopUnit();
        b.useOptimalUnit(undefined, [SATOSHIS.units[0], SATOSHIS.units[3], SATOSHIS.units[4]], 3);
    })
    .number(3, true)
    .append(" ")
    .unitCode()
    .build();
