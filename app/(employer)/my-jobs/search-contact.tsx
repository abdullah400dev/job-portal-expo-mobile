import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Link, useNavigation, useRouter } from "expo-router";
import Constants from "expo-constants";
import { UserContext } from "@/app/UserContext";
import { FlatList } from "react-native-gesture-handler";

// Define the type for job data
type Job = {
  _id: string;
  jobTitle: string;
  location: string;
  status: string;
  short_list: { userName: string }[]; // Array for short-listed users
  [key: string]: any;
};

export default function SearchJobScreen() {
  const { user } = useContext(UserContext);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string })
    .API_URL;
  const router = useRouter();

  // Fetch jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const url = `${apiBaseUrl}/api/shortlisted-jobs?userId=${
          user.userId || user._id
        }`;
        // console.log('Fetching jobs from:', url); // Log the full URL

        const response = await fetch(url);

        // Log the response status
        console.log("Response Status:", response.status);

        if (!response.ok) {
          const errorText = await response.text(); // Get error details
          console.error(
            `Error fetching jobs: ${response.status} ${response.statusText}`,
            errorText
          );
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Received non-JSON response");
          return;
        }

        const data = await response.json();
        console.log("Response data:", data);
        setJobs(data.jobDetails || []);
        setFilteredJobs(data.jobDetails || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle search input changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  
    if (query.trim() === "") {
      setFilteredJobs(jobs); // Show all jobs if search query is empty
    } else {
      const filtered = jobs.filter((job) => {
        const jobTitle = job.jobTitle?.toLowerCase() || ""; // Handle undefined jobTitle
        const location = job.location?.toLowerCase() || ""; // Handle undefined location
        const status = job.status?.toLowerCase() || "";     // Handle undefined status
  
        return (
          jobTitle.includes(query.toLowerCase()) ||
          location.includes(query.toLowerCase()) ||
          status.includes(query.toLowerCase())
        );
      });
      setFilteredJobs(filtered);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View>
        <View style={styles.headerIcons}></View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <View style={styles.tabButtonInactive}>
          <Link href="/my-jobs/">
            <Text style={styles.tabTextActive}>Posted Jobs</Text>
          </Link>
        </View>
        <View style={styles.tabButtonActive}>
          <Text style={styles.tabTextInactive}>Shortlist Users</Text>
        </View>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search jobs..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Job Cards */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.jobList}>
          {filteredJobs && filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <TouchableOpacity
                key={index}
                style={styles.jobCard}
                // onPress={() => {
                //   // Assuming job.short_list contains the shortlisted users

                //   router.push(
                //     `/messages?userId=${job.user._id}&userName=${job.user.userName}&currentUserId=${user.userId}`
                //   );
                // }}
              >
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job.jobTitle}</Text>
                  <Text style={styles.jobLocation}>{job.location}</Text>
                </View>
                <View style={styles.jobStatus}>
                    <Text style={styles.statusValue}>${job.price}</Text>
                  
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No jobs available</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  jobList: {
    flexGrow: 1,
    alignItems: "center",
  },
  jobCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "95%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.29,
    shadowRadius: 14,
    elevation: 7,
  },
  jobInfo: {},
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E2022",
  },
  jobLocation: {
    color: "#77838F",
    fontSize: 12,
    fontWeight: "400",
  },
  jobStatus: {
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#777",
  },
  statusValue: {
    fontSize: 12,
    fontWeight: "400",
    color: "#77838F",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#2684FF66",
    padding: 5,
    borderRadius: 20,
  },
  tabButtonActive: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  tabButtonInactive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  tabTextActive: {
    color: "#4B164C",
    fontWeight: "bold",
  },
  tabTextInactive: {
    color: "#4B164C",
    fontWeight: "bold",
  },
});
