import React from 'react';
import { Award, Users, Heart, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">About Gifty.</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          We are on a mission to make gifting personal, thoughtful, and powered by AI.
        </p>
      </div>

      {/* Stats / Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <Feature icon={Users} title="10k+" subtitle="Happy Customers" />
        <Feature icon={Award} title="Quality" subtitle="Handpicked Products" />
        <Feature icon={Globe} title="Global" subtitle="Shipping Worldwide" />
        <Feature icon={Heart} title="Made with" subtitle="Love & AI" />
      </div>

      {/* Story Content */}
      <div className="prose prose-blue mx-auto text-gray-600 space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Our Story</h3>
        <p>
          Founded in 2024, Gifty started with a simple idea: gifts should be unique. 
          Standard store-bought items often lack that personal touch. That's why we 
          combined traditional craftsmanship with modern Artificial Intelligence to allow 
          anyone to create one-of-a-kind personalized gifts in seconds.
        </p>
        <p>
          Whether it's a custom-printed mug with AI-generated art or a hand-engraved 
          piece of jewelry, we ensure every item that leaves our warehouse is crafted 
          to perfection.
        </p>
      </div>
    </div>
  );
};

const Feature = ({ icon: Icon, title, subtitle }) => (
  <div className="text-center p-6 bg-gray-50 rounded-2xl">
    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
    <h3 className="font-bold text-gray-900">{title}</h3>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </div>
);

export default About;