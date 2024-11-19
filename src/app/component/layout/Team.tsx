const people = [
    {
      name: 'Asmi Vats',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    // More people...
  ];
  
  export default function Team() {
    return (
      <div className="bg-gray-900 py-24 sm:py-32"> {/* Changed to a dark gray background */}
        <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"> {/* Adjusted to white text */}
              Meet our leadership
            </h2>
            <p className="mt-6 text-lg/8 text-gray-400"> {/* Adjusted to lighter gray for paragraph */}
              We’re a dynamic group of individuals who are passionate about what we do and dedicated to delivering the
              best results for our clients.
            </p>
          </div>
          <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
            {people.map((person) => (
              <li key={person.name}>
                <div className="flex items-center gap-x-6">
                  <img alt="" src={person.imageUrl} className="h-16 w-16 rounded-full" /> {/* Ensured consistent size */}
                  <div>
                    <h3 className="text-base/7 font-semibold tracking-tight text-white"> {/* Name in white */}
                      {person.name}
                    </h3>
                    <p className="text-sm/6 font-semibold text-indigo-400"> {/* Role in light indigo */}
                      {person.role}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  