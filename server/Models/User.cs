using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FuckSociety.Models
{
    public class User
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public string jwtToken { get; set; }
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
    }
}
