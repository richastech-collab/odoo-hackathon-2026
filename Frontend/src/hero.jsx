import { motion } from "framer-motion";
import {
  Truck,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  ShieldCheck,
  ArrowRight
} from "lucide-react";


function Hero() {

  const stats = [
    {
      number: "650+",
      label: "Vehicles Managed"
    },
    {
      number: "120+",
      label: "Active Drivers"
    },
    {
      number: "99.8%",
      label: "Fleet Efficiency"
    }
  ];


  const features = [
    {
      icon: Truck,
      text: "Vehicle Management"
    },
    {
      icon: Route,
      text: "Smart Dispatch"
    },
    {
      icon: Wrench,
      text: "Maintenance Automation"
    },
    {
      icon: Fuel,
      text: "Fuel Tracking"
    },
    {
      icon: BarChart3,
      text: "Real-time Analytics"
    },
    {
      icon: ShieldCheck,
      text: "Safety Compliance"
    }
  ];


  return (
    <section className="relative min-h-screen flex items-center px-6 py-20">

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">


        {/* Left Content */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-purple-500/10
            border
            border-purple-500/30
            text-purple-300
            text-sm
            mb-6
          ">
            🚚 Smart Transport Operations Platform
          </div>


          <h1 className="
            text-5xl
            md:text-6xl
            font-bold
            leading-tight
            text-white
          ">

            Manage Your Fleet

            <span className="
              block
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-purple-400
              to-indigo-400
            ">
              Smarter.
            </span>

          </h1>


          <p className="
            mt-6
            text-lg
            text-gray-400
            max-w-xl
            leading-relaxed
          ">

            TransitOps digitizes your complete transport lifecycle —
            vehicle registration, driver management, trip dispatch,
            maintenance, fuel tracking and analytics in one platform.

          </p>



          <div className="flex gap-4 mt-8">


            <button className="
              flex
              items-center
              gap-2
              px-7
              py-3
              rounded-xl
              bg-purple-600
              hover:bg-purple-700
              text-white
              font-semibold
              transition
            ">

              Get Started

              <ArrowRight size={18}/>

            </button>



            <button className="
              px-7
              py-3
              rounded-xl
              border
              border-gray-700
              text-white
              hover:bg-white/10
              transition
            ">

              View Demo

            </button>


          </div>




          {/* Statistics */}

          <div className="
            grid
            grid-cols-3
            gap-6
            mt-12
          ">

            {
              stats.map((item,index)=>(

                <div key={index}>

                  <h3 className="
                    text-3xl
                    font-bold
                    text-white
                  ">
                    {item.number}
                  </h3>


                  <p className="
                    text-sm
                    text-gray-400
                    mt-1
                  ">
                    {item.label}
                  </p>

                </div>

              ))
            }

          </div>
        </motion.div>
        {/* Right Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}

          className="relative"

        >


          <div className="
            rounded-3xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            p-6
            shadow-2xl
          ">
            <div className="
              rounded-2xl
              bg-[#0b1220]
              p-6
              border
              border-white/10
            ">
              <div className="
                flex
                justify-between
                items-center
                mb-6
              ">

                <h3 className="
                  text-white
                  font-semibold
                ">
                  Fleet Dashboard
                </h3>


                <span className="
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  bg-green-500/20
                  text-green-400
                ">
                  Live
                </span>
              </div>
              <div className="
                grid
                grid-cols-2
                gap-4
              ">
                <div className="
                  bg-white/5
                  rounded-xl
                  p-4
                ">
                  <p className="text-gray-400 text-sm">
                    Active Vehicles
                  </p>

                  <h2 className="
                    text-3xl
                    text-white
                    font-bold
                    mt-2
                  ">
                    248
                  </h2>

                </div>



                <div className="
                  bg-white/5
                  rounded-xl
                  p-4
                ">

                  <p className="text-gray-400 text-sm">
                    On Trip
                  </p>

                  <h2 className="
                    text-3xl
                    text-white
                    font-bold
                    mt-2
                  ">
                    86
                  </h2>

                </div>



                <div className="
                  bg-white/5
                  rounded-xl
                  p-4
                ">

                  <p className="text-gray-400 text-sm">
                    Maintenance
                  </p>

                  <h2 className="
                    text-3xl
                    text-white
                    font-bold
                    mt-2
                  ">
                    12
                  </h2>
                </div>
                <div className="
                  bg-white/5
                  rounded-xl
                  p-4
                ">
                  <p className="text-gray-400 text-sm">
                    Efficiency
                  </p>
                  <h2 className="
                    text-3xl
                    text-white
                    font-bold
                    mt-2
                  ">
                    92%
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {/* Floating Feature Cards */}
          <div className="
            grid
            grid-cols-2
            gap-3
            mt-6
          ">
          {
            features.map((item,index)=>{

              const Icon=item.icon;

              return(

                <div
                  key={index}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    bg-white/5
                    border
                    border-white/10
                    px-4
                    py-3
                  "
                >
                  <Icon
                    size={20}
                    className="text-purple-400"
                  />
                  <span className="
                    text-sm
                    text-gray-300
                  ">
                    {item.text}
                  </span>
                </div>
              )
            })
          }
          </div>
        </motion.div>
      </div>
    </section>
  );
}
export default Hero;
