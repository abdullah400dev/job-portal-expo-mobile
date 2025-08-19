import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import Constants from 'expo-constants';
import { UserContext } from '@/app/UserContext';

type Job = {
  _id: string;
  jobTitle: string;
  location: string;
  status: string;
  [key: string]: any;
};

export default function JobScreen() {
  const { user } = useContext(UserContext);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedID] = useState<string | null>(null);
  const [statusIndicator, setStatusIndicator] = useState(false);
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/job-by-id/${user.userId || user._id}`);
        const data = await response.json();
        console.log(data); // This will help you debug the structure of your response
        setJobs(data.jobs || []); // Ensure you're accessing the jobs array
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);


  const handleStatusToggle = async (job: Job) => {
    const newStatus = job.status === 'active' ? 'inactive' : 'active';
    setStatusIndicator(true);
    try {
      await axios.post(`${apiBaseUrl}/api/update-job-status`, {
        jobId: job._id,
        status: newStatus,
      });
      // Update local job status
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j._id === job._id ? { ...j, status: newStatus } : j
        )
      );
    } catch (error) {
      console.error('Error updating job status:', error);
    } finally {
      setStatusIndicator(false);
    }
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View >
          {/* Add any header icons or elements here */}
        </View>

      </View>
      <View style={styles.tabs}>
{/* <TouchableOpacity style={styles.tabButtonActive}>
<Text style={styles.tabTextActive}>Posted Jobs</Text>
</TouchableOpacity> */}
<View style={styles.tabButtonActive}>
<Text style={styles.tabTextActive}>Posted Jobs</Text>
</View>
{/* <TouchableOpacity style={styles.tabButtonInactive}>
<Link href='/my-jobs/search-contact'>
<Text style={styles.tabTextInactive}>Shortlist Users</Text>
</Link>
</TouchableOpacity> */}
<View style={styles.tabButtonInactive}>
<Link href='/my-jobs/search-contact'>
<Text style={styles.tabTextInactive}>Shortlist Users</Text>
</Link>
</View>
</View>
      {/* Job Cards */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.jobList}>
          {jobs?.map((job) => (
            <View key={job._id} style={styles.jobCard}>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.jobTitle}</Text>
                <Text style={styles.jobLocation}>{job.location}</Text>
              </View>

              <View style={styles.jobStatus}>
                <Text style={styles.statusText}>Job Status: {job.status}</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, job.status === 'active' ? styles.activeButton : styles.inactiveButton]}
                  onPress={() => handleStatusToggle(job)}
                >
                  <Text style={styles.toggleButtonText}>
                    {job.status === 'active' ? 'Set Inactive' : 'Set Active'}
                  </Text>
                </TouchableOpacity>
                {statusIndicator && selectedId === job._id && (
                  <ActivityIndicator size={10} color={"black"} />
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  jobList: {
    flexGrow: 1,
    alignItems: "center",
    // backgroundColor:"red",
    paddingBottom: 20,
    paddingTop:20,
  },
  jobCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '95%',
    elevation: 7,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E2022',
  },
  jobLocation: {
    color: '#77838F',
    fontSize: 12,
    fontWeight: '400',
  },
  jobStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777',
  },
  toggleButton: {
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  activeButton: {
    backgroundColor: 'green',
  },
  inactiveButton: {
    backgroundColor: 'red',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#2684FF66',
    padding: 5,
    borderRadius: 20,
    },
    tabButtonActive: {
      flex: 1,
      backgroundColor: '#fff',
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 20,
      },
      tabButtonInactive: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20,
        },
        tabTextActive: {
        color: '#4B164C',
        fontWeight: 'bold',
        },
        tabTextInactive: {
        color: '#4B164C',
        fontWeight: 'bold',
        },
        
});
