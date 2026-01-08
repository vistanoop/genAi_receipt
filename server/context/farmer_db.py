
# Dummy database of 30 farmers with their repayment history
# Status options: "good", "poor", "mixed", "none"

FARMER_DB = {
    "KC1-1001": {"name": "Ramesh Kumar", "history": "good"},
    "KC1-1002": {"name": "Suresh Patil", "history": "mixed"},
    "KC1-1003": {"name": "Mahesh Gowda", "history": "good"},
    "KC1-1004": {"name": "Ganesh Rao", "history": "poor"},
    "KC1-1005": {"name": "Vijay Singh", "history": "good"},
    "KC1-1006": {"name": "Anil Sharma", "history": "none"},
    "KC1-1007": {"name": "Sunil Verma", "history": "mixed"},
    "KC1-1008": {"name": "Kiran Reddy", "history": "good"},
    "KC1-1009": {"name": "Rajesh Gupta", "history": "poor"},
    "KC1-1010": {"name": "Amit Shah", "history": "good"},
    "KC1-1011": {"name": "Priya Nair", "history": "good"},
    "KC1-1012": {"name": "Rahul Dravid", "history": "none"},
    "KC1-1013": {"name": "Sachin Tend", "history": "good"},
    "KC1-1014": {"name": "Virat Kohl", "history": "mixed"},
    "KC1-1015": {"name": "Rohit Sharm", "history": "poor"},
    "KC1-1016": {"name": "Hardik Pan", "history": "good"},
    "KC1-1017": {"name": "Ravindra J", "history": "good"},
    "KC1-1018": {"name": "Jasprit B", "history": "mixed"},
    "KC1-1019": {"name": "Mohd Shami", "history": "good"},
    "KC1-1020": {"name": "KL Rahul", "history": "poor"},
    "KC1-1021": {"name": "Rishabh P", "history": "none"},
    "KC1-1022": {"name": "Shreyas I", "history": "good"},
    "KC1-1023": {"name": "Shikhar D", "history": "mixed"},
    "KC1-1024": {"name": "Ishant S", "history": "good"},
    "KC1-1025": {"name": "Umesh Y", "history": "poor"},
    "KC1-1026": {"name": "Bhuvneshwar", "history": "good"},
    "KC1-1027": {"name": "Yuzvendra C", "history": "none"},
    "KC1-1028": {"name": "Kuldeep Y", "history": "good"},
    "KC1-1029": {"name": "Axar Patel", "history": "mixed"},
    "KC1-1030": {"name": "Washy Sundar", "history": "good"}
}

def get_farmer_history(farmer_id):
    """
    Returns the repayment history for a given Farmer ID.
    Returns None if ID is not found.
    """
    farmer = FARMER_DB.get(farmer_id)
    if farmer:
        return farmer["history"]
    return None
