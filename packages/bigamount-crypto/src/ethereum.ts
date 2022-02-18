import {BigAmount, Unit, Units, NumberAmount, CreateAmount, FormatterBuilder, Predicates} from "@emeraldpay/bigamount";
import BigNumber from "bignumber.js";
import {SATOSHIS} from "./bitcoin";

export const WEIS = new Units(
    [
        new Unit(0, "Wei", "Wei"),
        new Unit(3, "Kwei", "KWei"),
        new Unit(6, "Mwei", "MWei"),
        new Unit(9, "Gwei", "GWei"),
        new Unit(12, "Microether", "μETH"),
        new Unit(15, "Milliether", "mETH"),
        new Unit(18, "Ether", "ETH"),
    ]
);

export const WEIS_ETC = new Units(
    [
        new Unit(0, "Wei", "Wei"),
        new Unit(3, "Kwei", "KWei"),
        new Unit(6, "Mwei", "MWei"),
        new Unit(9, "Gwei", "GWei"),
        new Unit(12, "Microether", "μETC"),
        new Unit(15, "Milliether", "mETC"),
        new Unit(18, "Ether", "ETC"),
    ]
);

export class WeiAny extends BigAmount {
    constructor(value: NumberAmount | BigAmount, units: Units) {
        super(value, units);
    }

    toHex(): string {
        return `${this.isNegative() ? '-' : ''}0x${this.number.abs().toString(16)}`;
    }

    toEther(): number {
        return this.number.dividedBy(this.units.top.multiplier).toNumber()
    }
}

export class Wei extends WeiAny {

    public static ZERO: Wei = new Wei(0);

    constructor(value: NumberAmount | BigAmount, unit?: string | Unit) {
        if (typeof unit !== "undefined") {
            if (BigAmount.is(value)) {
                throw new Error("Already BigAmount");
            }
            return BigAmount.createFor(value, WEIS, Wei.factory(), unit)
        }
        super(value, WEIS);
    }

    static fromEther(value: NumberAmount): Wei {
        return new Wei(value, "ETHER");
    }

    static factory(): CreateAmount<Wei> {
        return (value) => new Wei(value)
    }

    static is(value: any): value is Wei {
        return BigAmount.is(value) && WEIS.equals(value.units);
    }

    static decode(value: string): Wei {
        return BigAmount.decodeFor(value, WEIS, (n) => new Wei(n));
    }

    protected copyWith(value: BigNumber): this {
        // @ts-ignore
        return new Wei(value);
    }
}

export class WeiEtc extends WeiAny {
    public static ZERO: WeiEtc = new WeiEtc(0);

    constructor(value: NumberAmount | BigAmount, unit?: string | Unit) {
        if (typeof unit !== "undefined") {
            if (BigAmount.is(value)) {
                throw new Error("Already BigAmount");
            }
            return BigAmount.createFor(value, WEIS_ETC, WeiEtc.factory(), unit)
        }
        super(value, WEIS_ETC);
    }

    static factory(): CreateAmount<WeiEtc> {
        return (value) => new WeiEtc(value)
    }

    static is(value: any): value is WeiEtc {
        return BigAmount.is(value) && WEIS_ETC.equals(value.units);
    }

    static decode(value: string): WeiEtc {
        return BigAmount.decodeFor(value, WEIS_ETC, (n) => new WeiEtc(n));
    }

    static fromEther(value: NumberAmount): WeiEtc {
        return new WeiEtc(value, "ETHER");
    }

    protected copyWith(value: BigNumber): this {
        // @ts-ignore
        return new WeiEtc(value);
    }

}

export const EthereumFormatter = new FormatterBuilder()
    .when(Predicates.ZERO, (a, b) => {
        a.useTopUnit();
        b.useOptimalUnit(undefined, [WEIS.units[0], WEIS.units[3], WEIS.units[5], WEIS.units[6]]);
    })
    .number(3, true)
    .append(" ")
    .unitCode()
    .build();

export const EthereumClassicFormatter = new FormatterBuilder()
    .when(Predicates.ZERO, (a, b) => {
        a.useTopUnit();
        b.useOptimalUnit(undefined, [WEIS_ETC.units[0], WEIS_ETC.units[3], WEIS_ETC.units[5], WEIS_ETC.units[6]]);
    })
    .number(3, true)
    .append(" ")
    .unitCode()
    .build();