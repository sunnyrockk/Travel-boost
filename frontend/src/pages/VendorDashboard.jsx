import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyHotel = { name: "", destination: "", state: "", pricePerNight: "", roomsAvailable: 5, amenities: "" };
const emptyExperience = { title: "", destination: "", category: "Adventure", price: "", durationHours: 2, description: "" };
const emptyService = { title: "", destination: "", type: "Taxi", price: "", capacity: 4, durationHours: 2 };

export default function VendorDashboard() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [services, setServices] = useState([]);
  const [hotelForm, setHotelForm] = useState(emptyHotel);
  const [experienceForm, setExperienceForm] = useState(emptyExperience);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [message, setMessage] = useState("");

  async function load() {
    const [hotelResult, experienceResult, serviceResult] = await Promise.all([api.get("/hotels/mine"), api.get("/experiences/mine"), api.get("/travel-services/mine")]);
    setHotels(hotelResult.data);
    setExperiences(experienceResult.data);
    setServices(serviceResult.data);
  }

  useEffect(() => {
    if (user?.role === "vendor" || user?.role === "admin") load().catch(() => setMessage("Could not load your listings."));
  }, [user]);

  if (!user) return <p>Please <Link className="text-brand-600" to="/login">sign in</Link> as a vendor to manage listings.</p>;
  if (!["vendor", "admin"].includes(user.role)) return <p className="text-sm">This area is for tourism businesses. Register a vendor account to list your hotel or experience.</p>;

  async function submitHotel(e) {
    e.preventDefault(); setMessage("");
    try {
      await api.post("/hotels", { ...hotelForm, pricePerNight: Number(hotelForm.pricePerNight), roomsAvailable: Number(hotelForm.roomsAvailable), amenities: hotelForm.amenities.split(",").map(x => x.trim()).filter(Boolean) });
      setHotelForm(emptyHotel); setMessage("Hotel listed successfully."); load();
    } catch (err) { setMessage(err.response?.data?.message || "Could not list hotel."); }
  }

  async function submitExperience(e) {
    e.preventDefault(); setMessage("");
    try {
      await api.post("/experiences", { ...experienceForm, price: Number(experienceForm.price), durationHours: Number(experienceForm.durationHours) });
      setExperienceForm(emptyExperience); setMessage("Experience listed successfully."); load();
    } catch (err) { setMessage(err.response?.data?.message || "Could not list experience."); }
  }

  async function submitService(e) {
    e.preventDefault(); setMessage("");
    try {
      await api.post("/travel-services", { ...serviceForm, price: Number(serviceForm.price), capacity: Number(serviceForm.capacity), durationHours: Number(serviceForm.durationHours) });
      setServiceForm(emptyService); setMessage("Travel service listed successfully."); load();
    } catch (err) { setMessage(err.response?.data?.message || "Could not list travel service."); }
  }

  async function remove(kind, id) {
    if (!window.confirm("Remove this listing?")) return;
    await api.delete(`/${kind}/${id}`); load();
  }

  const field = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm";
  return <div className="space-y-6">
    <div><h1 className="text-xl font-bold">Vendor dashboard</h1><p className="text-sm text-gray-500">Add and manage your tourism offerings.</p></div>
    {message && <p className="text-sm text-brand-700">{message}</p>}
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={submitHotel} className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold">List a hotel or homestay</h2>
        {[['name','Property name'],['destination','Destination'],['state','State']].map(([key,label]) => <input key={key} required className={field} placeholder={label} value={hotelForm[key]} onChange={e=>setHotelForm({...hotelForm,[key]:e.target.value})}/>)}
        <div className="grid grid-cols-2 gap-3"><input required min="1" type="number" className={field} placeholder="Price per night" value={hotelForm.pricePerNight} onChange={e=>setHotelForm({...hotelForm,pricePerNight:e.target.value})}/><input required min="0" type="number" className={field} placeholder="Rooms available" value={hotelForm.roomsAvailable} onChange={e=>setHotelForm({...hotelForm,roomsAvailable:e.target.value})}/></div>
        <input className={field} placeholder="Amenities, comma separated" value={hotelForm.amenities} onChange={e=>setHotelForm({...hotelForm,amenities:e.target.value})}/>
        <button className="bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">Publish hotel</button>
      </form>
      <form onSubmit={submitExperience} className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold">List an experience</h2>
        {[['title','Experience title'],['destination','Destination']].map(([key,label]) => <input key={key} required className={field} placeholder={label} value={experienceForm[key]} onChange={e=>setExperienceForm({...experienceForm,[key]:e.target.value})}/>)}
        <select className={field} value={experienceForm.category} onChange={e=>setExperienceForm({...experienceForm,category:e.target.value})}>{["Adventure","Cultural","Food & Dining","Nature","Wellness"].map(x=><option key={x}>{x}</option>)}</select>
        <div className="grid grid-cols-2 gap-3"><input required min="1" type="number" className={field} placeholder="Price" value={experienceForm.price} onChange={e=>setExperienceForm({...experienceForm,price:e.target.value})}/><input required min="1" type="number" className={field} placeholder="Hours" value={experienceForm.durationHours} onChange={e=>setExperienceForm({...experienceForm,durationHours:e.target.value})}/></div>
        <button className="bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">Publish experience</button>
      </form>
    </div>
    <form onSubmit={submitService} className="bg-white border rounded-xl p-5 space-y-3">
      <h2 className="font-semibold">List local travel support</h2>
      <div className="grid md:grid-cols-3 gap-3"><input required className={field} placeholder="Service name" value={serviceForm.title} onChange={e=>setServiceForm({...serviceForm,title:e.target.value})}/><input required className={field} placeholder="Destination" value={serviceForm.destination} onChange={e=>setServiceForm({...serviceForm,destination:e.target.value})}/><select className={field} value={serviceForm.type} onChange={e=>setServiceForm({...serviceForm,type:e.target.value})}>{["Taxi","Airport Transfer","Local Guide","Bus","Car Rental"].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="grid md:grid-cols-3 gap-3"><input required min="1" type="number" className={field} placeholder="Price" value={serviceForm.price} onChange={e=>setServiceForm({...serviceForm,price:e.target.value})}/><input required min="1" type="number" className={field} placeholder="Capacity" value={serviceForm.capacity} onChange={e=>setServiceForm({...serviceForm,capacity:e.target.value})}/><input required min="1" type="number" className={field} placeholder="Hours" value={serviceForm.durationHours} onChange={e=>setServiceForm({...serviceForm,durationHours:e.target.value})}/></div>
      <button className="bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">Publish travel service</button>
    </form>
    <div className="grid lg:grid-cols-3 gap-6"><Listing title="Your hotels" entries={hotels} kind="hotels" onRemove={remove} render={h=>`${h.name} · ${h.destination} · ₹${h.pricePerNight}/night`}/><Listing title="Your experiences" entries={experiences} kind="experiences" onRemove={remove} render={e=>`${e.title} · ${e.destination} · ₹${e.price}`}/><Listing title="Your travel services" entries={services} kind="travel-services" onRemove={remove} render={s=>`${s.title} · ${s.destination} · ₹${s.price}`}/></div>
  </div>;
}

function Listing({ title, entries, kind, onRemove, render }) {
  return <section className="bg-white border rounded-xl p-5"><h2 className="font-semibold mb-3">{title}</h2>{entries.length ? <div className="space-y-2">{entries.map(entry=><div className="flex justify-between gap-3 text-sm border-b pb-2" key={entry._id}><span>{render(entry)}</span><button onClick={()=>onRemove(kind,entry._id)} className="text-red-600">Remove</button></div>)}</div> : <p className="text-sm text-gray-400">No listings yet.</p>}</section>;
}
