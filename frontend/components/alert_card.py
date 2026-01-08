"""
Alert Card Component
Display clinical alerts with icons and color coding
"""

import streamlit as st
from typing import List

# Alert definitions with icons and descriptions
ALERT_DEFINITIONS = {
    'HYPERTENSIVE_CRISIS': {
        'icon': '🔴',
        'title': 'Hypertensive Crisis',
        'color': '#c62828',
        'description': 'Blood pressure ≥140/90 mmHg indicates preeclampsia risk'
    },
    'HYPOXIA': {
        'icon': '💨',
        'title': 'Hypoxia',
        'color': '#d32f2f',
        'description': 'Low oxygen saturation (<94%) indicates respiratory distress'
    },
    'TACHYCARDIA': {
        'icon': '💓',
        'title': 'Tachycardia',
        'color': '#e64a19',
        'description': 'Elevated heart rate (>120 bpm) may indicate hemorrhage or infection'
    },
    'HYPERTHERMIA': {
        'icon': '🌡️',
        'title': 'Hyperthermia',
        'color': '#f57c00',
        'description': 'High temperature (>38.5°C) suggests possible infection'
    },
    'HYPOGLYCEMIA': {
        'icon': '⬇️',
        'title': 'Hypoglycemia',
        'color': '#ffa000',
        'description': 'Low blood sugar (<3.0 mmol/L) increases seizure risk'
    },
    'HYPERGLYCEMIA': {
        'icon': '⬆️',
        'title': 'Hyperglycemia',
        'color': '#ff8f00',
        'description': 'High blood sugar (>11.0 mmol/L) indicates gestational diabetes crisis'
    },
    'ADVANCED_MATERNAL_AGE': {
        'icon': '👵',
        'title': 'Advanced Maternal Age',
        'color': '#fbc02d',
        'description': 'Age ≥35 years increases chromosomal abnormality risk'
    },
    'POST_TERM_PREGNANCY': {
        'icon': '📅',
        'title': 'Post-term Pregnancy',
        'color': '#afb42b',
        'description': 'Pregnancy >40 weeks increases stillbirth risk'
    }
}

def show_alert_card(assessment_result):
    """
    Display assessment result card with risk level and alerts
    
    Args:
        assessment_result: Dict containing risk assessment results
    """
    
    # Handle if it's a dict (API result) or string (legacy)
    if isinstance(assessment_result, dict):
        risk_level = assessment_result.get('risk_level', 'UNKNOWN')
        confidence = assessment_result.get('confidence', 0)
        alerts = assessment_result.get('alerts', [])
        clinical_notes = assessment_result.get('clinical_notes', [])
        
        # Risk level color mapping
        risk_colors = {
            'CRITICAL': '#c62828',
            'HIGH': '#e64a19',
            'MEDIUM': '#f9a825',
            'LOW': '#388e3c',
            'UNKNOWN': '#757575'
        }
        
        risk_icons = {
            'CRITICAL': '🆘',
            'HIGH': '⚠️',
            'MEDIUM': '⚡',
            'LOW': '✅',
            'UNKNOWN': '❓'
        }
        
        color = risk_colors.get(risk_level, '#757575')
        icon = risk_icons.get(risk_level, '❓')
        
        # Display risk level card
        st.markdown(f"""
        <div style="background-color: {color}20; 
                    border-left: 5px solid {color}; 
                    padding: 20px; 
                    border-radius: 10px; 
                    margin: 15px 0;">
            <h3 style="color: {color}; margin: 0;">
                {icon} Risk Level: {risk_level}
            </h3>
            <p style="margin: 10px 0 0 0; color: #424242; font-size: 16px;">
                Confidence: {confidence:.1%}
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # Display alerts
        if alerts:
            st.markdown("### ⚠️ Clinical Alerts")
            for alert in alerts:
                if isinstance(alert, str):
                    alert_info = ALERT_DEFINITIONS.get(alert, {
                        'icon': '⚠️',
                        'title': alert.replace('_', ' ').title() if isinstance(alert, str) else str(alert),
                        'color': '#757575',
                        'description': 'Clinical alert detected'
                    })
                else:
                    # If alert is not a string, just display it as is
                    st.warning(f"• {alert}")
                    continue
                
                st.markdown(f"""
                <div style="background-color: {alert_info['color']}20; 
                            border-left: 4px solid {alert_info['color']}; 
                            padding: 12px; 
                            border-radius: 5px; 
                            margin: 8px 0;">
                    <h5 style="color: {alert_info['color']}; margin: 0;">
                        {alert_info['icon']} {alert_info['title']}
                    </h5>
                    <p style="margin: 5px 0 0 0; color: #424242; font-size: 14px;">
                        {alert_info['description']}
                    </p>
                </div>
                """, unsafe_allow_html=True)
        
        # Display clinical notes
        if clinical_notes:
            st.markdown("### 📋 Clinical Notes")
            for note in clinical_notes:
                st.info(f"• {note}")
                
    else:
        # Legacy: handle if it's just an alert type string
        alert_type = assessment_result
        alert_info = ALERT_DEFINITIONS.get(alert_type, {
            'icon': '⚠️',
            'title': alert_type.replace('_', ' ').title() if isinstance(alert_type, str) else str(alert_type),
            'color': '#757575',
            'description': 'Clinical alert detected'
        })
        
        st.markdown(f"""
        <div style="background-color: {alert_info['color']}20; 
                    border-left: 5px solid {alert_info['color']}; 
                    padding: 15px; 
                    border-radius: 5px; 
                    margin: 10px 0;">
            <h4 style="color: {alert_info['color']}; margin: 0;">
                {alert_info['icon']} {alert_info['title']}
            </h4>
            <p style="margin: 5px 0 0 0; color: #424242;">
                {alert_info['description']}
            </p>
        </div>
        """, unsafe_allow_html=True)
