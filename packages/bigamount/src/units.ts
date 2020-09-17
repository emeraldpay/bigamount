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

        this.multiplier = new BigNumber(10).exponentiatedBy(decimals)
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

    getUnit(value: BigAmount, limit?: Unit): Unit {
        let number = value.number;
        limit = limit || this.base;
        for (let i = this.units.length - 1; i > 0; i--) {
            let unit = this.units[i];
            if (limit.decimals == unit.decimals) {
                return unit;
            }
            if (number.isGreaterThanOrEqualTo(unit.decimals)) {
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