import { PersonTable } from "../models/person.model";
import { PolicyHolderRegistration } from "../models/policy.model";

export class PolicyLogic {
    static registrationPerson(person: PersonTable): PolicyHolderRegistration[] {
        const result:PolicyHolderRegistration[] = []
        if (person.id_card) result.push({
            registrationType: "id_card",
            value: person.id_card
        })
        if (person.passport) result.push({
            registrationType: "passport",
            value: person.passport
        })
        return result
    }
}