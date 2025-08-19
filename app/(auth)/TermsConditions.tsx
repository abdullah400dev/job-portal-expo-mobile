import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { useRouter } from "expo-router";
import { UserContext } from "../UserContext";

export default function TermsAndConditionsScreen() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const handleAccept = () => {
    if(user.employer === 'employer'){
    router.push("/(employer)");
    }else{
      router.push("/(tabs)");
    }
  };

  const handleDecline = () => {
    Alert.alert("Terms Declined", "You must accept the terms to continue.");
  };
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Content */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.summaryText}>Summary</Text>
          <Text style={styles.paragraph}>
            Eum animi reiciendis et impedit porro sed obcaecati quos sit
            repudiandae accusantium vel deserunt rerum et molestiae omnis eum
            nulla nemo. Ab officia reprehenderit ut sunt porro aut eveniet velit
            non libero dolorem. Qui labore voluptas rem beatae consequatur qui
            maiores illo ad natus nihil ut internos fugit et ipsum dolores.
            quasi. Qui ullam consequuntur et nisi labore quo eaque iusto?
          </Text>

          <Text style={styles.termsHeader}>Terms Of Services</Text>
          <Text style={styles.paragraph}>
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis

            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quisenim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis

            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quisenim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            enim aut laudantium alias? Quo cupiditate perspiciatis sit veritatis
            voluptate est eaque quasi eos officiis odio vel eius magnam?Aut
            consequuntur rerum nam accusamus voluptatibus et nihil corporis qui
            accusamus quae non autem veniam. Et expedita illo cum labore neque
            in labore voluptas. Et quae error qui voluptates doloremque sed
            repellendus iusto aut voluptatum iure aut Quis
            
          </Text>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.declineButton}
            activeOpacity={1}
            onPress={handleDecline}
          >
            <Text style={styles.declineButtonText}>I Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            activeOpacity={1}
            onPress={handleAccept}
          >
            <Text style={styles.acceptButtonText}>I Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#f5f5f5",
  },
  wrapper: {
    backgroundColor: "#fff",
    height: "97%",
    borderRadius: 18,
    margin: 10,
  },
  header: {
    backgroundColor: "#3b82f6",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 20,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#757575",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: "#757575",
    marginBottom: 20,
    fontWeight: "400",
  },
  termsHeader: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#757575",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  declineButton: {
    borderWidth: 1,
    borderColor: "#1F93D6",
    paddingVertical: 6,
    paddingHorizontal: 35,
    borderRadius: 25,
  },
  declineButtonText: {
    color: "#1F93D6",
    fontSize: 15,
    fontWeight: "600",
  },
  acceptButton: {
    backgroundColor: "#007DC5",
    paddingVertical: 6,
    paddingHorizontal: 35,
    borderRadius: 25,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
