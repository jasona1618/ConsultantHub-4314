import ReactEcharts from 'echarts-for-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const projectProgress = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: Array.from({length: 7}, (_, i) => 
        format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'MMM dd')
      ).reverse()
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [30, 45, 55, 70, 85, 90, 95],
      type: 'line',
      smooth: true
    }]
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
          <p className="text-3xl font-bold text-primary-600">4</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
          <p className="text-3xl font-bold text-primary-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Hours Logged</h3>
          <p className="text-3xl font-bold text-primary-600">87</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
        <ReactEcharts option={projectProgress} style={{height: '300px'}} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {['Document updated', 'New comment added', 'Meeting scheduled'].map((activity, index) => (
              <div key={index} className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {['Project Review - Mar 15', 'Client Meeting - Mar 18', 'Deliverable Due - Mar 20'].map((deadline, index) => (
              <div key={index} className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                <span>{deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;