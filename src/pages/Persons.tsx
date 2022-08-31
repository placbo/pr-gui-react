import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { PERSONS_URL } from '../constants';

export const Persons: FC = () => {
  const [persons, setpersons] = useState<any>([]);

  useEffect(() => {
    const asyncAxiosFunction = async () => {
      const result = await axios.get(PERSONS_URL, {
        headers: {
          'X-Auth-Token': localStorage.getItem('token') ?? '',
        },
      });
      console.log(result.data.data.length);

      setpersons(result.data.data);
    };
    asyncAxiosFunction();
  }, []);

  return (
    <div>
      {persons &&
        persons.map((person: any) => (
          <pre key={person.personID}>
            {person.firstName} {person.lastName}
          </pre>
        ))}
    </div>
  );
};
