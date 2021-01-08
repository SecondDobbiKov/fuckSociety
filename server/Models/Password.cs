using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FuckSociety.Models
{
    public class Password
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string PassWord { get; set; }
    }
}
