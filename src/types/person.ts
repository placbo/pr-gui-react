export interface Person {
  personID: string;
  firstName: string;
  lastName: string;
  comment: string;
  facebookLink: string;
  born: string;
  dead: string;
  mainImage: string;
  imageName: string;
}

export const emptyPerson: Person = {
  personID: '',
  lastName: '',
  firstName: '',
  comment: '',
  facebookLink: '',
  born: '',
  dead: '',
  mainImage: '',
  imageName: '',
};

// "@faker-js/faker": "^7.3.0";|
// const generateMockPerson = (): Person => {
//   return {
//     lastName: faker.name.lastName(),
//     firstName: faker.name.firstName(),
//     note: faker.lorem.sentence(),
//     born: '',
//     deceased: '',
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
