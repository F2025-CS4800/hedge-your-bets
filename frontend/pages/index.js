import { useState } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    sport: 'football',
    team: '',
    player: '',
    betType: '',
    action: '',
    actionAmount: '',
    betAmount: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)

  // Team and player data - Football only
  const teamData = {
    football: {
      'Kansas City Chiefs': ['Patrick Mahomes', 'Travis Kelce', 'Tyreek Hill', 'Clyde Edwards-Helaire', 'Tyrann Mathieu'],
      'Tampa Bay Buccaneers': ['Tom Brady', 'Mike Evans', 'Leonard Fournette', 'Rob Gronkowski', 'Antonio Brown'],
      'Green Bay Packers': ['Aaron Rodgers', 'Davante Adams', 'Aaron Jones', 'Randall Cobb', 'Jaire Alexander'],
      'Buffalo Bills': ['Josh Allen', 'Stefon Diggs', 'Cole Beasley', 'Devin Singletary', 'Tre\'Davious White'],
      'Los Angeles Rams': ['Matthew Stafford', 'Cooper Kupp', 'Odell Beckham Jr.', 'Cam Akers', 'Aaron Donald'],
      'Dallas Cowboys': ['Dak Prescott', 'Ezekiel Elliott', 'Amari Cooper', 'CeeDee Lamb', 'Micah Parsons'],
      'New England Patriots': ['Mac Jones', 'Damien Harris', 'Jakobi Meyers', 'Hunter Henry', 'Matthew Judon'],
      'Pittsburgh Steelers': ['Ben Roethlisberger', 'Najee Harris', 'Diontae Johnson', 'Chase Claypool', 'T.J. Watt']
    }
  }

  // Football action options
  const actionOptions = [
    'Passing Yards',
    'Rushing Yards', 
    'Receiving Yards',
    'Receptions',
    'Touchdowns',
    'Completions',
    'Interceptions'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Handle cascading dropdowns
    if (name === 'team') {
      setFormData(prev => ({
        ...prev,
        team: value,
        player: '' // Reset player when team changes
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call - replace with actual backend integration later
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmissionResult({
        success: true,
        message: 'Betting scenario created successfully!',
        data: formData
      })
      
      // Reset form
      setFormData({
        sport: 'football',
        team: '',
        player: '',
        betType: '',
        action: '',
        actionAmount: '',
        betAmount: ''
      })
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: 'Error creating betting scenario. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🏈 Hedge Your Bets</h1>
        <p style={styles.subtitle}>AI-Powered Sports Betting Analysis</p>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Create New Betting Scenario</h2>
          <p style={styles.cardDescription}>
            Enter your betting details below and let our AI analyze the potential value of your bet.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Sport - Fixed to Football */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Sport</label>
              <div style={styles.fixedValue}>
                Football
              </div>
            </div>

            {/* Team Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Team *</label>
              <select
                name="team"
                value={formData.team}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select Team</option>
                {Object.keys(teamData.football || {}).map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            {/* Player Selection - conditional */}
            {formData.team && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Player *</label>
                <select
                  name="player"
                  value={formData.player}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select Player</option>
                  {teamData.football[formData.team]?.map(player => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Bet Type - Over/Under Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Bet Type *</label>
              <select
                name="betType"
                value={formData.betType}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select Over or Under</option>
                <option value="over">Over</option>
                <option value="under">Under</option>
              </select>
            </div>

            {/* Action Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Action *</label>
              <select
                name="action"
                value={formData.action}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select Action</option>
                {actionOptions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>

            {/* Action Amount - Threshold for the action */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Action Amount *</label>
              <input
                type="number"
                name="actionAmount"
                value={formData.actionAmount}
                onChange={handleInputChange}
                placeholder="e.g., 250 for passing yards, 6 for receptions"
                min="0"
                step="0.1"
                style={styles.input}
                required
              />
              <div style={styles.helpText}>
                Enter the threshold number for your action (yards, catches, etc.)
              </div>
            </div>

            {/* Bet Amount - Money wagered */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Bet Amount ($) *</label>
              <input
                type="number"
                name="betAmount"
                value={formData.betAmount}
                onChange={handleInputChange}
                placeholder="100"
                min="1"
                step="0.01"
                style={styles.input}
                required
              />
              <div style={styles.helpText}>
                Enter how much money you want to wager
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitButton,
                ...(isSubmitting ? styles.submitButtonDisabled : {})
              }}
            >
              {isSubmitting ? 'Analyzing...' : 'Analyze Bet'}
            </button>
          </form>

          {submissionResult && (
            <div style={{
              ...styles.resultMessage,
              ...(submissionResult.success ? styles.successMessage : styles.errorMessage)
            }}>
              <p>{submissionResult.message}</p>
              {submissionResult.success && submissionResult.data && (
                <div style={styles.resultData}>
                  <h4>Submitted Data:</h4>
                  <pre style={styles.dataPreview}>
                    {JSON.stringify(submissionResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '0',
    margin: '0'
  },
  header: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '2rem 0',
    textAlign: 'center',
    color: 'white'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  subtitle: {
    fontSize: '1.2rem',
    margin: '0',
    opacity: 0.9
  },
  main: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)'
  },
  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
    color: '#333'
  },
  cardDescription: {
    color: '#666',
    margin: '0 0 2rem 0',
    fontSize: '1rem',
    lineHeight: '1.5'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#333'
  },
  input: {
    padding: '0.75rem',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    outline: 'none'
  },
  select: {
    padding: '0.75rem',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'border-color 0.2s ease',
    outline: 'none'
  },
  textarea: {
    padding: '0.75rem',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
    outline: 'none'
  },
  submitButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    marginTop: '1rem'
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none'
  },
  resultMessage: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.95rem'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  resultData: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #dee2e6'
  },
  dataPreview: {
    fontSize: '0.85rem',
    margin: '0.5rem 0 0 0',
    backgroundColor: 'white',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
    overflow: 'auto'
  },
  fixedValue: {
    padding: '0.75rem',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#f8f9fa',
    color: '#666',
    fontStyle: 'italic'
  },
  helpText: {
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '0.25rem',
    fontStyle: 'italic'
  }
}
