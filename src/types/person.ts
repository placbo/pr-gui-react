export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  note: string;
  facebookLink: string;
  born: string;
  dead: string;
  mainImageId: string;
  imageName: string;
}

export const emptyPerson: Person = {
  id: '',
  lastName: '',
  firstName: '',
  note: '',
  facebookLink: '',
  born: '',
  dead: '',
  mainImageId: '',
  imageName: '',
};

export enum RelationshipRole {
  Parent = 1,
  Child = 2,
  Partner = 3,
  Sibling = 4,
  Collegue = 5,
}

// "@faker-js/faker": "^7.3.0";|
// const generateMockPerson = (): Person => {
//   return {
//     lastName: faker.name.lastName(),
//     firstName: faker.name.firstName(),
//     note: faker.lorem.sentence(),
//     born: '',
//     dead: '',
//     facebookLink: '' + faker.datatype.number(),
//     id: faker.datatype.uuid(),
//     //profileImageUrl: faker.image.people(100, 100, true),
//   };
// };

// export const generateMockPersonArray = () => {
//   const persons = new Array<Person>();
//   for (let i = 0; i < 10; i++) {
//     persons.push(generateMockPerson());
//   }
//   return persons;
// };
