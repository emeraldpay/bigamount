import BigNumber from "bignumber.js";
import {BigAmount} from "./amount";

export class Unit {
    private readonly kind = "emerald.BigAmount.Unit";

    readonly decimals: number;
    readonly name: string;
    readonly code: string;

    readonly multiplier: BigNumber;

    constructor(decimals: number, name: string, code: string | undefined) {
        if (decimals < 0) {
            throw new Error("Decimals cannot be negative number")
        }
        this.decimals = decimals;
        this.name = name;
        this.code = code || name;

        this.multiplier = new BigNumber(10).pow(decimals)
    }

    static is(value: any): value is Unit {
        return typeof value === 'object'
            && value !== null
            && Object.entries(value).some((a) => a[0] === 'kind' && a[1] === "emerald.BigAmount.Unit")
    }

    equals(o: Unit): boolean {
        return Unit.is(o) && this.decimals == o.decimals && this.name == o.name && this.code == o.code
    }

    toString(): string {
        return this.code
    }
}

export class Units {
    private readonly kind = "emerald.BigAmount.Units";

    readonly units: Unit[]

    constructor(units: Unit[]) {
        if (typeof units != 'object' || units.length == 0) {
            throw new Error("Units cannot be empty")
        }
        const copy: Unit[] = [];
        copy.push(...units);
        copy.sort((a, b) => a.decimals - b.decimals);
        this.units = copy;
    }

    static is(value: any): value is Units {
        return typeof value === 'object'
            && value !== null
            && Object.entries(value).some((a) => a[0] === 'kind' && a[1] === "emerald.BigAmount.Units")
    }

    get base(): Unit {
        return this.units[0];
    }

    get top(): Unit {
        return this.units[this.units.length - 1];
    }

    equals(o: Units): boolean {
        if (!Units.is(o)) {
            return false;
        }
        if (o.units.length != this.units.length) {
            return false;
        }
        for (let i = 0; i < this.units.length; i++) {
            let ti = this.units[i];
            let ou = o.units[i];
            if (!ti.equals(ou)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Search for an optimal Unit for the number considering the provided criteria. Optimal is a unit which is closest
     * to the number to display with least numbers.
     *
     * Ex. for a number 500,000 and unit 0, 1000, and 1,000,000 the second one is optimal because it gives just 500.
     *
     * @param value number to find unit
     * @param limit smallest unit to accept
     * @param useUnits list of possible units to check
     * @param decimals max number of decimals to accept for a unit. i.e. 2 means accept two decimals (like 0.25) for a unit
     */
    getUnit(value: BigAmount | BigNumber | number, limit?: Unit, useUnits: Unit[] = this.units, decimals?: number): Unit {
        useUnits = useUnits || this.units;
        let number: BigNumber;
        if (typeof value == "number") {
            number = new BigNumber(value);
        } else if (BigAmount.is(value)) {
            number = value.number;
        } else if (BigNumber.isBigNumber(value)) {
            number = value
        } else {
            throw new Error("Invalid value type" + value)
        }
        number = number.absoluteValue();
        let numberWithDecimals = null;
        if (typeof decimals != "undefined") {
            numberWithDecimals = number.multipliedBy(new BigNumber(10).pow(decimals));
        }
        limit = limit || this.base;
        // goes from the largest unit to the smallest, checking first which fits the criteria
        for (let i = useUnits.length - 1; i > 0; i--) {
            let unit = useUnits[i];
            // when reached the limit return it, that's the final unit
            if (limit.decimals == unit.decimals) {
                return unit;
            }
            // when reach a unit which is smaller that our number,
            // ex. unit with multiplier 1000 and the number 1234.
            if (number.isGreaterThanOrEqualTo(unit.multiplier)) {
                return unit;
            }
            // alternatively check with same logic but considering the decimals,
            // i.e. if we accept 2 decimals then number 123 should still fit unit with multiplier 1000
            if (numberWithDecimals != null && numberWithDecimals.isGreaterThanOrEqualTo(unit.multiplier)) {
                return unit;
            }
        }
        return limit
    }

    contains(unit: Unit): boolean {
        return this.units.some((o) => o.equals(unit));
    }

    toString(): String {
        return this.base.toString();
    }
}