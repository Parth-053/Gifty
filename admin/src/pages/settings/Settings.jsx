import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, updateSettings } from "../../store/settingsSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Settings = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.settings);
  const [form, setForm] = useState({ taxRate: 0, platformFee: 0 });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (data) setForm({ taxRate: data.taxRate, platformFee: data.platformFee });
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSettings(form));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Global Tax Rate (%)" 
            type="number" 
            value={form.taxRate} 
            onChange={(e) => setForm({...form, taxRate: e.target.value})} 
          />
          <Input 
            label="Platform Commission Fee (%)" 
            type="number" 
            value={form.platformFee} 
            onChange={(e) => setForm({...form, platformFee: e.target.value})} 
          />
          <Button type="submit" isLoading={loading}>Save Settings</Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;