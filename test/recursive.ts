import {test} from "ava"
import {createFactory, getSnapshot, types, IFactory} from "../"

// WIP
// test("it should create recursive factories", t => {
//     const Factory = types.recursive('Factory', type =>
//         createFactory({
//             child: types.array(type)
//         })
//     )

//     const doc = Factory()
//     t.deepEqual<any>(getSnapshot(doc), {child: []})
// })