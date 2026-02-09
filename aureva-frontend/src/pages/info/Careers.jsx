import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiSend, FiHeart, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import Footer from '../../components/common/Footer';

export default function Careers() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: ''
  });

  const jobs = [
    {
      id: 1,
      title: 'Senior Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$120k - $150k',
      description: 'Lead product strategy and development for our e-commerce platform.',
      requirements: [
        '5+ years of product management experience',
        'E-commerce or beauty industry experience preferred',
        'Strong analytical and leadership skills',
        'Excellent communication abilities'
      ]
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $130k',
      description: 'Build and maintain our web applications using React, Node.js, and MySQL.',
      requirements: [
        '3+ years of full-stack development experience',
        'Proficiency in React, Node.js, and SQL',
        'Experience with cloud platforms (AWS/Azure)',
        'Strong problem-solving skills'
      ]
    },
    {
      id: 3,
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$70k - $90k',
      description: 'Drive customer acquisition and engagement through digital marketing campaigns.',
      requirements: [
        '2+ years of digital marketing experience',
        'Expertise in SEO, SEM, and social media',
        'Data-driven mindset with analytics skills',
        'Creative and strategic thinker'
      ]
    },
    {
      id: 4,
      title: 'Customer Success Manager',
      department: 'Customer Service',
      location: 'Hybrid',
      type: 'Full-time',
      salary: '$60k - $80k',
      description: 'Ensure customer satisfaction and build long-term relationships.',
      requirements: [
        '2+ years in customer success or support',
        'Excellent communication skills',
        'Problem-solving mindset',
        'Experience with CRM tools'
      ]
    },
    {
      id: 5,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $110k',
      description: 'Create beautiful and intuitive user experiences for our platform.',
      requirements: [
        '3+ years of UI/UX design experience',
        'Proficiency in Figma, Sketch, or Adobe XD',
        'Strong portfolio demonstrating design skills',
        'Understanding of user-centered design principles'
      ]
    },
    {
      id: 6,
      title: 'Content Writer',
      department: 'Marketing',
      location: 'Remote',
      type: 'Part-time',
      salary: '$40k - $55k',
      description: 'Create engaging content for our blog, product descriptions, and marketing materials.',
      requirements: [
        '2+ years of content writing experience',
        'Beauty or wellness industry knowledge preferred',
        'SEO writing skills',
        'Excellent grammar and storytelling abilities'
      ]
    }
  ];

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Application submitted for ${selectedJob.title}! We'll be in touch soon.`);
    setShowApplicationForm(false);
    setSelectedJob(null);
    setFormData({ name: '', email: '', phone: '', resume: '', coverLetter: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-white/90">Help us redefine beauty e-commerce</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <HiSparkles className="text-4xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Why Aureva Beauty?</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            At Aureva Beauty, we're more than just an e-commerce platform. We're a team of passionate individuals 
            dedicated to helping people discover their natural radiance. Join us in our mission to make premium 
            beauty products accessible to everyone.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="text-3xl text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Great Culture</h3>
              <p className="text-sm text-gray-600">Collaborative and inclusive work environment</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-3xl text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Growth</h3>
              <p className="text-sm text-gray-600">Continuous learning and career development</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-3xl text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Team Spirit</h3>
              <p className="text-sm text-gray-600">Work with talented and supportive colleagues</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="text-3xl text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Benefits</h3>
              <p className="text-sm text-gray-600">Competitive salary and comprehensive benefits</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Open Positions</h2>
          <p className="text-gray-600 mb-8">
            Explore our current openings and find your perfect role. We're always looking for talented individuals 
            to join our growing team.
          </p>

          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiBriefcase className="text-purple-600" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMapPin className="text-purple-600" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="text-purple-600" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiDollarSign className="text-purple-600" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApply(job)}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>

                <p className="text-gray-600 mb-4">{job.description}</p>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="mb-6">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for 
            future opportunities.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Apply for {selectedJob?.title}</h2>
              <p className="text-white/90 mt-1">{selectedJob?.department} • {selectedJob?.location}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV URL *</label>
                <input
                  type="url"
                  value={formData.resume}
                  onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="https://..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Link to your resume (Google Drive, Dropbox, etc.)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Tell us why you're a great fit for this role..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <FiSend />
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowApplicationForm(false);
                    setSelectedJob(null);
                    setFormData({ name: '', email: '', phone: '', resume: '', coverLetter: '' });
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
