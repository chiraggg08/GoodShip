import { useState } from 'react'
import './App.css'

// Initial Sample Data tailored for Maharashtra freight corridors
const INITIAL_LOADS = [
  {
    id: 'LOAD-101',
    title: 'Industrial Machinery & Spare Parts',
    pickup: 'Pune',
    destination: 'Nagpur',
    vehicleType: '32ft Container',
    weight: '12 Tons',
    price: 42000,
    shipper: 'Kirloskar Engineering Ltd',
    status: 'Open',
    date: 'Today'
  },
  {
    id: 'LOAD-102',
    title: 'Fresh Farm Produce & Grapes',
    pickup: 'Nashik',
    destination: 'Mumbai',
    vehicleType: '14ft Eicher',
    weight: '7 Tons',
    price: 16500,
    shipper: 'Sahyadri Agro Farms',
    status: 'Open',
    date: 'Today'
  },
  {
    id: 'LOAD-103',
    title: 'Automobile Components & Assemblies',
    pickup: 'Pune',
    destination: 'Thane',
    vehicleType: 'Tata Ace',
    weight: '3 Tons',
    price: 11000,
    shipper: 'AutoTech Solutions',
    status: 'Open',
    date: 'Tomorrow'
  },
  {
    id: 'LOAD-104',
    title: 'Cotton Textile Fabrics',
    pickup: 'Bhiwandi',
    destination: 'Kolhapur',
    vehicleType: '10-Wheeler Open Heavy',
    weight: '15 Tons',
    price: 28500,
    shipper: 'Mahalaxmi Weaving Mills',
    status: 'Open',
    date: 'Today'
  },
  {
    id: 'LOAD-105',
    title: 'Structural Steel Rods & TMT Bars',
    pickup: 'Nagpur',
    destination: 'Mumbai',
    vehicleType: 'Trailer Multi-Axle',
    weight: '22 Tons',
    price: 58000,
    shipper: 'Vidarbha Steel Corp',
    status: 'Open',
    date: '2 Days'
  },
  {
    id: 'LOAD-106',
    title: 'FMCG Packaged Foods',
    pickup: 'Mumbai',
    destination: 'Nashik',
    vehicleType: '20ft Container',
    weight: '9 Tons',
    price: 21000,
    shipper: 'Godrej Goods Ltd',
    status: 'Open',
    date: 'Today'
  }
]

const INITIAL_TRUCKS = [
  {
    id: 'TRK-201',
    regNumber: 'MH 14 HG 9921',
    operator: 'Patil Freight Carriers',
    vehicleType: '32ft Container',
    bodyType: 'Closed Container',
    location: 'Pune',
    destination: 'Nagpur',
    capacity: '18 Tons',
    rate: 40000,
    rating: '4.9',
    status: 'Available'
  },
  {
    id: 'TRK-202',
    regNumber: 'MH 04 ER 4410',
    operator: 'Swaraj Logistics Thane',
    vehicleType: '14ft Eicher',
    bodyType: 'Closed Container',
    location: 'Thane',
    destination: 'Nashik',
    capacity: '6 Tons',
    rate: 14500,
    rating: '4.8',
    status: 'Available'
  },
  {
    id: 'TRK-203',
    regNumber: 'MH 15 AB 7731',
    operator: 'Nashik Roadlines',
    vehicleType: '10-Wheeler Open Heavy',
    bodyType: 'Open Body',
    location: 'Nashik',
    destination: 'Mumbai',
    capacity: '16 Tons',
    rate: 24000,
    rating: '4.7',
    status: 'Available'
  },
  {
    id: 'TRK-204',
    regNumber: 'MH 31 CB 1120',
    operator: 'Vidarbha Heavy Haulers',
    vehicleType: 'Trailer Multi-Axle',
    bodyType: 'Trailer',
    location: 'Nagpur',
    destination: 'Pune',
    capacity: '20 Tons',
    rate: 48000,
    rating: '4.9',
    status: 'Available'
  },
  {
    id: 'TRK-205',
    regNumber: 'MH 09 DX 5543',
    operator: 'Kolhapur Express Service',
    vehicleType: 'Tata Ace',
    bodyType: 'Open Body',
    location: 'Kolhapur',
    destination: 'Pune',
    capacity: '1.5 Tons',
    rate: 7500,
    rating: '4.6',
    status: 'Available'
  }
]

function App() {
  // Demo Auth Session State: null if unauthenticated, or user object
  const [currentUser, setCurrentUser] = useState(null)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'

  // Navigation State: 'login' | 'truck-owner' | 'goods-owner'
  const [currentView, setCurrentView] = useState('login')

  // Sub-navigation tabs (Sidebar active screen)
  // Truck Owner: 'find-shipments' | 'my-trucks' | 'add-truck' | 'my-bids' | 'incoming-requests' | 'active-rides' | 'rides-done'
  const [truckOwnerTab, setTruckOwnerTab] = useState('find-shipments')

  // Goods Owner: 'find-trucks' | 'post-shipment' | 'my-shipments' | 'requests-sent' | 'bids-received' | 'active-rides' | 'ride-history'
  const [goodsOwnerTab, setGoodsOwnerTab] = useState('find-trucks')

  // Sidebar collapsible state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Submitting flags to prevent duplicate form submissions
  const [isSubmittingTruck, setIsSubmittingTruck] = useState(false)
  const [isSubmittingLoad, setIsSubmittingLoad] = useState(false)

  // Marketplace lists state
  const [loads, setLoads] = useState(INITIAL_LOADS)
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS)

  // Booking requests counters
  const [truckOwnerBookings, setTruckOwnerBookings] = useState(0)
  const [goodsOwnerBookings, setGoodsOwnerBookings] = useState(0)

  // Toast / notification banner state: { message: '', type: 'success' | 'error' }
  const [toast, setToast] = useState({ message: '', type: 'success' })

  // Search and Filter State
  const [searchPickup, setSearchPickup] = useState('')
  const [searchDestination, setSearchDestination] = useState('')
  const [filterVehicle, setFilterVehicle] = useState('All')

  // Modal States
  const [biddingLoad, setBiddingLoad] = useState(null)
  const [bidAmount, setBidAmount] = useState('')
  const [bidNotes, setBidNotes] = useState('')

  const [bookingTruckModal, setBookingTruckModal] = useState(null)
  const [bookingNotes, setBookingNotes] = useState('')

  // Login & Signup Form States
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    role: 'truck-owner' // 'truck-owner' | 'goods-owner'
  })

  // Truck Owner Listing Form (Standalone Add Truck screen)
  const [truckForm, setTruckForm] = useState({
    regNumber: '',
    vehicleType: '14ft Eicher',
    capacity: '',
    bodyType: 'Closed Container',
    location: 'Mumbai',
    availability: 'Available',
    rate: '15000'
  })

  // Goods Owner Post Load Form (Standalone Post Shipment screen)
  const [loadForm, setLoadForm] = useState({
    title: '',
    pickup: 'Mumbai',
    destination: 'Pune',
    vehicleType: '14ft Eicher',
    weight: '',
    price: '',
    shipper: 'My Enterprise'
  })

  // Toast Helper
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast({ message: '', type: 'success' })
    }, 4500)
  }

  // Clear search filters
  const handleClearFilters = () => {
    setSearchPickup('')
    setSearchDestination('')
    setFilterVehicle('All')
  }

  // DEMO AUTH: Login Handler
  const handleDemoLogin = (e) => {
    e.preventDefault()
    const email = loginForm.email.trim()
    const password = loginForm.password

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      triggerToast('⚠️ Validation Error: Please enter a valid email address.', 'error')
      return
    }
    if (!password || password.length < 6) {
      triggerToast('⚠️ Validation Error: Password must be at least 6 characters.', 'error')
      return
    }

    // Determine demo role (e.g. if email contains 'goods' or user selected demo profile)
    const assignedRole = email.toLowerCase().includes('goods') ? 'goods-owner' : 'truck-owner'
    const namePart = email.split('@')[0]
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1)

    const userObj = {
      name: formattedName,
      email: email,
      role: assignedRole
    }

    setCurrentUser(userObj)
    setCurrentView(assignedRole)
    if (assignedRole === 'truck-owner') {
      setTruckOwnerTab('find-shipments')
    } else {
      setGoodsOwnerTab('find-trucks')
    }

    triggerToast(`✅ Welcome back, ${userObj.name}! Logged in as ${assignedRole === 'truck-owner' ? 'Truck Owner' : 'Goods Owner'} (Demo Mode).`, 'success')
  }

  // DEMO AUTH: Signup Handler
  const handleDemoSignup = (e) => {
    e.preventDefault()
    const fullName = signupForm.fullName.trim()
    const email = signupForm.email.trim()
    const password = signupForm.password
    const confirmPassword = signupForm.confirmPassword
    const selectedRole = signupForm.role

    if (!fullName || fullName.length < 2) {
      triggerToast('⚠️ Validation Error: Please enter your full name.', 'error')
      return
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      triggerToast('⚠️ Validation Error: Please enter a valid email address.', 'error')
      return
    }
    if (!password || password.length < 6) {
      triggerToast('⚠️ Validation Error: Password must be at least 6 characters.', 'error')
      return
    }
    if (password !== confirmPassword) {
      triggerToast('⚠️ Validation Error: Passwords do not match.', 'error')
      return
    }

    const userObj = {
      name: fullName,
      email: email,
      role: selectedRole,
      phone: signupForm.phone.trim(),
      company: signupForm.company.trim()
    }

    setCurrentUser(userObj)
    setCurrentView(selectedRole)
    if (selectedRole === 'truck-owner') {
      setTruckOwnerTab('find-shipments')
    } else {
      setGoodsOwnerTab('find-trucks')
    }

    triggerToast(`🎉 Demo account created! Welcome ${userObj.name} (${selectedRole === 'truck-owner' ? 'Truck Owner' : 'Goods Owner'}).`, 'success')
  }

  // DEMO AUTH: Logout Handler
  const handleDemoLogout = () => {
    setCurrentUser(null)
    setCurrentView('login')
    setAuthMode('login')
    setLoginForm({ email: '', password: '' })
    setSignupForm({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      company: '',
      role: 'truck-owner'
    })
    triggerToast('ℹ️ Logged out of demo session.', 'success')
  }

  // PART 3: Validate & Add Truck (Separate Add Truck Screen)
  const handleAddTruck = (e) => {
    e.preventDefault()
    if (isSubmittingTruck) return
    setIsSubmittingTruck(true)

    const trimmedReg = truckForm.regNumber.trim().toUpperCase()
    const capacityNum = parseFloat(truckForm.capacity)
    const rateNum = parseFloat(truckForm.rate) || 15000

    if (!trimmedReg || trimmedReg.length < 5) {
      triggerToast('⚠️ Validation Error: Enter a valid Registration Number string (e.g. MH 12 AB 1234).', 'error')
      setIsSubmittingTruck(false)
      return
    }
    if (isNaN(capacityNum) || capacityNum <= 0) {
      triggerToast('⚠️ Validation Error: Load Capacity must be a positive number of Tons.', 'error')
      setIsSubmittingTruck(false)
      return
    }

    const newTruck = {
      id: `TRK-${Math.floor(200 + Math.random() * 800)}`,
      regNumber: trimmedReg, // String preserved
      operator: currentUser ? `${currentUser.name}'s Fleet` : 'My Fleet',
      vehicleType: truckForm.vehicleType,
      bodyType: truckForm.bodyType,
      location: truckForm.location,
      destination: 'Flexible Route',
      capacity: `${capacityNum} Tons`,
      rate: rateNum,
      rating: '5.0',
      status: truckForm.availability
    }

    setTrucks([newTruck, ...trucks])
    setTruckForm({
      regNumber: '',
      vehicleType: '14ft Eicher',
      capacity: '',
      bodyType: 'Closed Container',
      location: 'Mumbai',
      availability: 'Available',
      rate: '15000'
    })
    setIsSubmittingTruck(false)
    triggerToast(`✅ Truck ${newTruck.regNumber} (${newTruck.capacity}) added to your fleet!`, 'success')
    setTruckOwnerTab('my-trucks') // Switch to My Trucks screen to see addition
  }

  // PART 4: Validate & Post Load Requirement (Separate Post Shipment Screen)
  const handlePostLoad = (e) => {
    e.preventDefault()
    if (isSubmittingLoad) return
    setIsSubmittingLoad(true)

    const trimmedTitle = loadForm.title.trim()
    const weightNum = parseFloat(loadForm.weight)
    const priceNum = parseFloat(loadForm.price)

    if (!trimmedTitle || trimmedTitle.length < 3) {
      triggerToast('⚠️ Validation Error: Enter a clear cargo description (at least 3 characters).', 'error')
      setIsSubmittingLoad(false)
      return
    }
    if (loadForm.pickup === loadForm.destination) {
      triggerToast('⚠️ Validation Error: Pickup City and Destination City cannot be the same.', 'error')
      setIsSubmittingLoad(false)
      return
    }
    if (isNaN(weightNum) || weightNum <= 0) {
      triggerToast('⚠️ Validation Error: Cargo Weight must be a positive number of Tons.', 'error')
      setIsSubmittingLoad(false)
      return
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('⚠️ Validation Error: Offered Price must be a positive amount in ₹.', 'error')
      setIsSubmittingLoad(false)
      return
    }

    const newLoad = {
      id: `LOAD-${Math.floor(100 + Math.random() * 900)}`,
      title: trimmedTitle,
      pickup: loadForm.pickup,
      destination: loadForm.destination,
      vehicleType: loadForm.vehicleType,
      weight: `${weightNum} Tons`,
      price: priceNum,
      shipper: currentUser ? currentUser.company || currentUser.name : loadForm.shipper,
      status: 'Open',
      date: 'Today'
    }

    setLoads([newLoad, ...loads])
    setLoadForm({
      title: '',
      pickup: 'Mumbai',
      destination: 'Pune',
      vehicleType: '14ft Eicher',
      weight: '',
      price: '',
      shipper: 'My Enterprise'
    })
    setIsSubmittingLoad(false)
    triggerToast(`✅ Cargo shipment requirement "${newLoad.title}" posted successfully!`, 'success')
    setGoodsOwnerTab('my-shipments') // Switch to My Shipments screen to see addition
  }

  // Bidding & Booking Modal Actions
  const handleOpenBidModal = (load) => {
    setBiddingLoad(load)
    setBidAmount(load.price)
    setBidNotes('')
  }

  const handleConfirmBid = (e) => {
    e.preventDefault()
    const amountNum = parseFloat(bidAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      triggerToast('⚠️ Please enter a valid positive bid amount in ₹.', 'error')
      return
    }

    setLoads(
      loads.map((load) =>
        load.id === biddingLoad.id
          ? {
              ...load,
              status: `Bid Submitted`,
              myBid: amountNum
            }
          : load
      )
    )
    setTruckOwnerBookings((prev) => prev + 1)
    const submittedId = biddingLoad.id
    setBiddingLoad(null)
    triggerToast(`🎉 Bid of ₹${amountNum.toLocaleString('en-IN')} submitted for ${submittedId}! Shipper notified.`, 'success')
  }

  const handleOpenBookingModal = (truck) => {
    setBookingTruckModal(truck)
    setBookingNotes('')
  }

  const handleConfirmBooking = (e) => {
    e.preventDefault()
    setTrucks(
      trucks.map((t) =>
        t.id === bookingTruckModal.id
          ? { ...t, status: 'Request Pending' }
          : t
      )
    )
    setGoodsOwnerBookings((prev) => prev + 1)
    const truckReg = bookingTruckModal.regNumber
    const operator = bookingTruckModal.operator
    setBookingTruckModal(null)
    triggerToast(`🎉 Booking request sent to ${operator} (${truckReg})!`, 'success')
  }

  // Filtered Lists Logic
  const filteredLoads = loads.filter((l) => {
    const matchPickup = l.pickup.toLowerCase().includes(searchPickup.toLowerCase().trim())
    const matchDest = l.destination.toLowerCase().includes(searchDestination.toLowerCase().trim())
    const matchVehicle = filterVehicle === 'All' || l.vehicleType === filterVehicle
    return matchPickup && matchDest && matchVehicle
  })

  const filteredTrucks = trucks.filter((t) => {
    const matchLocation = t.location.toLowerCase().includes(searchPickup.toLowerCase().trim())
    const matchDest = t.destination.toLowerCase().includes(searchDestination.toLowerCase().trim())
    const matchVehicle = filterVehicle === 'All' || t.vehicleType === filterVehicle
    return matchLocation && matchDest && matchVehicle
  })

  const myBidsList = loads.filter((l) => l.myBid || l.status === 'Bid Submitted')
  const requestsSentList = trucks.filter((t) => t.status === 'Request Pending')

  const hasActiveFilters = searchPickup !== '' || searchDestination !== '' || filterVehicle !== 'All'

  return (
    <div className="page-wrapper">
      {/* Top Notification Banner */}
      {toast.message && (
        <div className={`toast-banner ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast({ message: '', type: 'success' })}>×</button>
        </div>
      )}

      {/* Header Navigation */}
      <header className="header">
        <div className="container header-container">
          <div className="logo" onClick={() => currentUser ? null : setCurrentView('login')} style={{ cursor: currentUser ? 'default' : 'pointer' }} title="GoodShip">
            <span className="logo-icon">🚛</span>
            <span className="logo-text">GoodShip<span className="dot">.</span></span>
          </div>

          {/* PART 2: Remove Top Nav buttons for logged-in users; Show Header User Profile */}
          {currentUser ? (
            <div className="header-user-profile">
              <div className="user-info-box">
                <div className="user-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
                <div>
                  <span className="user-name-text">{currentUser.name}</span>
                </div>
                <span className={`user-role-badge ${currentUser.role === 'truck-owner' ? 'green' : 'navy'}`}>
                  {currentUser.role === 'truck-owner' ? '🚛 Truck Owner' : '📦 Goods Owner'}
                </span>
              </div>
              <button className="logout-btn" onClick={handleDemoLogout} title="Log out of demo session">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-links">
              <button
                className={`nav-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button
                className={`nav-btn ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {/* ===================================== */}
        {/* PART 1: LOGIN & SIGNUP SCREENS        */}
        {/* ===================================== */}
        {!currentUser && (
          <div className="auth-wrapper">
            {authMode === 'login' ? (
              <div className="auth-card">
                <div className="auth-header">
                  <h1 className="auth-brand">GoodShip</h1>
                  <p className="auth-tagline">The smarter way to move goods.</p>
                  <span className="demo-notice-tag">DEMO MODE • Client-side Validation</span>
                </div>

                <form onSubmit={handleDemoLogin}>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. truckowner@goodship.in"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '12px' }}>
                    Sign In to Dashboard
                  </button>
                </form>

                <div className="auth-footer">
                  Don't have a demo account?
                  <button className="auth-link" onClick={() => setAuthMode('signup')}>
                    Sign Up
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-card">
                <div className="auth-header">
                  <h1 className="auth-brand">Create GoodShip Account</h1>
                  <p className="auth-tagline">Select your role and start moving goods efficiently.</p>
                  <span className="demo-notice-tag">DEMO MODE • Select Your Role</span>
                </div>

                <form onSubmit={handleDemoSignup}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Chirag Bhandari"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. chirag@logistics.in"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Password *</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm Password *</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone (Optional)</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Company (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Sahyadri Logistics"
                        value={signupForm.company}
                        onChange={(e) => setSignupForm({ ...signupForm, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Select Account Role *</label>
                    <div className="role-selector-grid">
                      <button
                        type="button"
                        className={`role-option-btn ${signupForm.role === 'truck-owner' ? 'selected' : ''}`}
                        onClick={() => setSignupForm({ ...signupForm, role: 'truck-owner' })}
                      >
                        <span className="icon">🚛</span>
                        <span className="title">Truck Owner</span>
                      </button>

                      <button
                        type="button"
                        className={`role-option-btn ${signupForm.role === 'goods-owner' ? 'selected' : ''}`}
                        onClick={() => setSignupForm({ ...signupForm, role: 'goods-owner' })}
                      >
                        <span className="icon">📦</span>
                        <span className="title">Goods Owner</span>
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-secondary full-width" style={{ marginTop: '16px' }}>
                    Complete Sign Up & Open Dashboard
                  </button>
                </form>

                <div className="auth-footer">
                  Already have a demo account?
                  <button className="auth-link" onClick={() => setAuthMode('login')}>
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================== */}
        {/* TRUCK OWNER PORTAL                    */}
        {/* ===================================== */}
        {currentUser && currentUser.role === 'truck-owner' && (
          <div className="portal-layout">
            {/* PART 3: Truck Owner Sidebar */}
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
              <div className="sidebar-toggle-bar">
                <span className="sidebar-title">Truck Owner Menu</span>
                <button
                  className="sidebar-toggle-btn"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {isSidebarCollapsed ? '▶' : '◀'}
                </button>
              </div>

              <nav className="sidebar-nav">
                <button
                  className={`sidebar-item ${truckOwnerTab === 'find-shipments' ? 'active' : ''}`}
                  onClick={() => setTruckOwnerTab('find-shipments')}
                  title="Find Shipments"
                >
                  <span className="icon">📦</span>
                  <span className="label">Find Shipments</span>
                </button>

                <button
                  className={`sidebar-item ${truckOwnerTab === 'my-trucks' ? 'active' : ''}`}
                  onClick={() => setTruckOwnerTab('my-trucks')}
                  title="My Trucks"
                >
                  <span className="icon">🚚</span>
                  <span className="label">My Trucks ({trucks.length})</span>
                </button>

                <button
                  className={`sidebar-item ${truckOwnerTab === 'add-truck' ? 'active' : ''}`}
                  onClick={() => setTruckOwnerTab('add-truck')}
                  title="Add Truck"
                >
                  <span className="icon">➕</span>
                  <span className="label">Add Truck</span>
                </button>

                <button
                  className={`sidebar-item ${truckOwnerTab === 'my-bids' ? 'active' : ''}`}
                  onClick={() => setTruckOwnerTab('my-bids')}
                  title="My Bids"
                >
                  <span className="icon">📑</span>
                  <span className="label">My Bids ({myBidsList.length})</span>
                </button>

                <button
                  className={`sidebar-item ${truckOwnerTab === 'incoming-requests' ? 'active' : ''}`}
                  onClick={() => setTruckOwnerTab('incoming-requests')}
                  title="Incoming Requests"
                >
                  <span className="icon">📥</span>
                  <span className="label">Incoming Requests</span>
                </button>

                <button
                  className={`sidebar-item ${truckOwnerTab === 'active-rides' ? 'active' : ''}`}
                  onClick={() => setTruckOwnerTab('active-rides')}
                  title="Active Rides"
                >
                  <span className="icon">🛣️</span>
                  <span className="label">Active Rides</span>
                </button>

                <button
                  className={`sidebar-item ${truckOwnerTab === 'rides-done' ? 'active' : ''}`}
                  onClick={() => setTruckOwnerTab('rides-done')}
                  title="Rides Done"
                >
                  <span className="icon">✅</span>
                  <span className="label">Rides Done</span>
                </button>
              </nav>
            </aside>

            {/* Portal Canvas */}
            <div className="portal-canvas">
              <div className="dashboard-header">
                <div>
                  <h1 className="dash-title">
                    {truckOwnerTab === 'find-shipments' && 'Find Available Shipments'}
                    {truckOwnerTab === 'my-trucks' && 'My Registered Trucks'}
                    {truckOwnerTab === 'add-truck' && 'Register & Add New Truck'}
                    {truckOwnerTab === 'my-bids' && 'My Submitted Bids'}
                    {truckOwnerTab === 'incoming-requests' && 'Incoming Booking Requests'}
                    {truckOwnerTab === 'active-rides' && 'Active Rides'}
                    {truckOwnerTab === 'rides-done' && 'Completed Rides History'}
                  </h1>
                  <p className="dash-sub">
                    {truckOwnerTab === 'find-shipments' && 'Search cargo postings and submit freight bids.'}
                    {truckOwnerTab === 'my-trucks' && 'Manage your registered fleet vehicles and routes.'}
                    {truckOwnerTab === 'add-truck' && 'Add a new vehicle registration to your fleet.'}
                    {truckOwnerTab === 'my-bids' && 'Review your active proposals submitted to shippers.'}
                    {truckOwnerTab === 'incoming-requests' && 'Booking requests received from goods owners.'}
                    {truckOwnerTab === 'active-rides' && 'In-transit shipments currently active.'}
                    {truckOwnerTab === 'rides-done' && 'Past completed shipments and trip history.'}
                  </p>
                </div>
                <span className="role-pill green">🚛 Truck Owner Mode</span>
              </div>

              {/* Summary Stats Header */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-icon">🚛</span>
                  <div>
                    <div className="stat-value">{trucks.length}</div>
                    <div className="stat-label">Available Trucks Listed</div>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">📦</span>
                  <div>
                    <div className="stat-value">{loads.length}</div>
                    <div className="stat-label">Matching Loads Available</div>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">🔔</span>
                  <div>
                    <div className="stat-value">{myBidsList.length}</div>
                    <div className="stat-label">My Active Bids</div>
                  </div>
                </div>
              </div>

              {/* SCREEN 1: FIND SHIPMENTS (DEFAULT) */}
              {truckOwnerTab === 'find-shipments' && (
                <div>
                  <div className="card filter-card">
                    <div className="filter-header">
                      <h3 className="filter-title">Search & Filter Marketplace Loads</h3>
                      <span className="filter-count">
                        Showing {filteredLoads.length} of {loads.length} loads
                        {hasActiveFilters && (
                          <button className="clear-btn" onClick={handleClearFilters}>Clear Filters</button>
                        )}
                      </span>
                    </div>

                    <div className="filter-row">
                      <input
                        type="text"
                        placeholder="Filter Pickup City (e.g. Pune)"
                        value={searchPickup}
                        onChange={(e) => setSearchPickup(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Filter Destination City"
                        value={searchDestination}
                        onChange={(e) => setSearchDestination(e.target.value)}
                      />
                      <select
                        value={filterVehicle}
                        onChange={(e) => setFilterVehicle(e.target.value)}
                      >
                        <option value="All">All Vehicle Types</option>
                        <option value="14ft Eicher">14ft Eicher</option>
                        <option value="32ft Container">32ft Container</option>
                        <option value="10-Wheeler Open Heavy">10-Wheeler Open</option>
                        <option value="Tata Ace">Tata Ace</option>
                        <option value="Trailer Multi-Axle">Trailer Multi-Axle</option>
                        <option value="20ft Container">20ft Container</option>
                      </select>
                    </div>
                  </div>

                  <div className="items-list">
                    {filteredLoads.length === 0 ? (
                      <div className="empty-state-card">
                        <div className="empty-icon">🔍</div>
                        <h3>No Matching Loads Found</h3>
                        <p>No open shipments match your current search filters.</p>
                        {hasActiveFilters && (
                          <button className="btn btn-outline" onClick={handleClearFilters}>Clear Filters</button>
                        )}
                      </div>
                    ) : (
                      filteredLoads.map((load) => (
                        <div className="card item-card" key={load.id}>
                          <div className="item-header">
                            <div>
                              <span className="item-id">{load.id}</span>
                              <h4 className="item-title">{load.title}</h4>
                              <span className="shipper-name">Shipper: {load.shipper}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div className="item-price">₹{load.price.toLocaleString('en-IN')}</div>
                              {load.myBid && (
                                <span className="bid-badge">Your Bid: ₹{load.myBid.toLocaleString('en-IN')}</span>
                              )}
                            </div>
                          </div>

                          <div className="item-details">
                            <div className="detail-chip">
                              <span className="chip-label">Route</span>
                              <strong>{load.pickup} ➔ {load.destination}</strong>
                            </div>
                            <div className="detail-chip">
                              <span className="chip-label">Vehicle</span>
                              <span>{load.vehicleType}</span>
                            </div>
                            <div className="detail-chip">
                              <span className="chip-label">Weight</span>
                              <span>{load.weight}</span>
                            </div>
                          </div>

                          <div className="item-footer">
                            <span className={`status-tag ${load.status === 'Open' ? 'green' : 'blue'}`}>
                              ● {load.status}
                            </span>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleOpenBidModal(load)}
                              disabled={load.status !== 'Open'}
                            >
                              {load.status === 'Open' ? 'Accept & Bid Load' : 'Bid Submitted'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SCREEN 2: MY TRUCKS (SEPARATED FROM FORM) */}
              {truckOwnerTab === 'my-trucks' && (
                <div>
                  <div className="section-top-bar">
                    <h2>Registered Vehicles ({trucks.length})</h2>
                    <button className="btn btn-primary" onClick={() => setTruckOwnerTab('add-truck')}>
                      + Add New Truck
                    </button>
                  </div>

                  {trucks.length === 0 ? (
                    <div className="empty-state-card">
                      <div className="empty-icon">🚚</div>
                      <h3>No Trucks Registered Yet</h3>
                      <p>List your vehicles to match with shippers and receive booking requests.</p>
                      <button className="btn btn-primary" onClick={() => setTruckOwnerTab('add-truck')}>
                        List Your First Truck
                      </button>
                    </div>
                  ) : (
                    <div className="items-list">
                      {trucks.map((truck) => (
                        <div className="card item-card" key={truck.id}>
                          <div className="item-header">
                            <div>
                              <span className="item-id">{truck.regNumber}</span>
                              <h4 className="item-title">{truck.operator}</h4>
                            </div>
                            <div className="item-price">₹{truck.rate.toLocaleString('en-IN')}</div>
                          </div>

                          <div className="item-details">
                            <div className="detail-chip">
                              <span className="chip-label">Current Route</span>
                              <strong>{truck.location} ➔ {truck.destination}</strong>
                            </div>
                            <div className="detail-chip">
                              <span className="chip-label">Vehicle Spec</span>
                              <span>{truck.vehicleType}</span>
                            </div>
                            <div className="detail-chip">
                              <span className="chip-label">Body Type</span>
                              <span>{truck.bodyType || 'Closed Body'}</span>
                            </div>
                            <div className="detail-chip">
                              <span className="chip-label">Load Capacity</span>
                              <span>{truck.capacity}</span>
                            </div>
                          </div>

                          <div className="item-footer">
                            <span className={`status-tag ${truck.status === 'Available' ? 'green' : 'orange'}`}>
                              ● {truck.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 3: ADD TRUCK (SEPARATE FORM SCREEN) */}
              {truckOwnerTab === 'add-truck' && (
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                  <div className="card form-card">
                    <h2 className="card-title">Add Vehicle to Fleet</h2>
                    <form onSubmit={handleAddTruck}>
                      <div className="form-group">
                        <label>Truck Registration Number *</label>
                        <input
                          type="text"
                          placeholder="e.g. MH 12 AB 1234"
                          value={truckForm.regNumber}
                          onChange={(e) => setTruckForm({ ...truckForm, regNumber: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Vehicle Type *</label>
                          <select
                            value={truckForm.vehicleType}
                            onChange={(e) => setTruckForm({ ...truckForm, vehicleType: e.target.value })}
                          >
                            <option value="14ft Eicher">14ft Eicher (Medium Container)</option>
                            <option value="32ft Container">32ft Container (Multi-Axle)</option>
                            <option value="10-Wheeler Open Heavy">10-Wheeler Open Heavy</option>
                            <option value="Tata Ace">Tata Ace (1.5T Small LCV)</option>
                            <option value="Trailer Multi-Axle">Trailer Heavy Multi-Axle</option>
                            <option value="20ft Container">20ft Container</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Truck Body Type *</label>
                          <select
                            value={truckForm.bodyType}
                            onChange={(e) => setTruckForm({ ...truckForm, bodyType: e.target.value })}
                          >
                            <option value="Closed Container">Closed Container</option>
                            <option value="Open Body">Open Body</option>
                            <option value="Trailer">Trailer</option>
                            <option value="Flatbed">Flatbed</option>
                            <option value="Tarpaulined">Tarpaulined</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Load Capacity (Tons) *</label>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="e.g. 12"
                            value={truckForm.capacity}
                            onChange={(e) => setTruckForm({ ...truckForm, capacity: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Expected Price / Rate (₹) *</label>
                          <input
                            type="number"
                            placeholder="e.g. 25000"
                            value={truckForm.rate}
                            onChange={(e) => setTruckForm({ ...truckForm, rate: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Current Location *</label>
                          <select
                            value={truckForm.location}
                            onChange={(e) => setTruckForm({ ...truckForm, location: e.target.value })}
                          >
                            <option value="Mumbai">Mumbai</option>
                            <option value="Pune">Pune</option>
                            <option value="Nashik">Nashik</option>
                            <option value="Nagpur">Nagpur</option>
                            <option value="Thane">Thane</option>
                            <option value="Kolhapur">Kolhapur</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Availability *</label>
                          <select
                            value={truckForm.availability}
                            onChange={(e) => setTruckForm({ ...truckForm, availability: e.target.value })}
                          >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary full-width"
                        disabled={isSubmittingTruck}
                        style={{ marginTop: '12px' }}
                      >
                        {isSubmittingTruck ? 'Adding Truck...' : '+ Register & Add Truck'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* SCREEN 4: MY BIDS */}
              {truckOwnerTab === 'my-bids' && (
                <div>
                  {myBidsList.length === 0 ? (
                    <div className="empty-state-card">
                      <div className="empty-icon">📑</div>
                      <h3>No Active Bids Placed</h3>
                      <p>You have not placed any bids on shipments yet. Go to Find Shipments to propose rates.</p>
                      <button className="btn btn-primary" onClick={() => setTruckOwnerTab('find-shipments')}>
                        Browse Find Shipments
                      </button>
                    </div>
                  ) : (
                    <div className="items-list">
                      {myBidsList.map((load) => (
                        <div className="card item-card" key={load.id}>
                          <div className="item-header">
                            <div>
                              <span className="item-id">{load.id}</span>
                              <h4 className="item-title">{load.title}</h4>
                              <span className="shipper-name">Shipper: {load.shipper}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div className="item-price">₹{load.price.toLocaleString('en-IN')}</div>
                              <span className="bid-badge">Your Submitted Bid: ₹{load.myBid ? load.myBid.toLocaleString('en-IN') : load.price.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <div className="item-details">
                            <div className="detail-chip">
                              <span className="chip-label">Route</span>
                              <strong>{load.pickup} ➔ {load.destination}</strong>
                            </div>
                            <div className="detail-chip">
                              <span className="chip-label">Vehicle</span>
                              <span>{load.vehicleType}</span>
                            </div>
                          </div>

                          <div className="item-footer">
                            <span className="status-tag blue">● Bid Pending Shipper Review</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 5: INCOMING REQUESTS */}
              {truckOwnerTab === 'incoming-requests' && (
                <div className="empty-state-card">
                  <div className="empty-icon">📥</div>
                  <h3>No Incoming Requests Yet</h3>
                  <p>When goods owners request your listed trucks, incoming booking requests will appear here.</p>
                </div>
              )}

              {/* SCREEN 6: ACTIVE RIDES */}
              {truckOwnerTab === 'active-rides' && (
                <div className="empty-state-card">
                  <div className="empty-icon">🛣️</div>
                  <h3>No Active Rides In Transit</h3>
                  <p>When a bid or booking request is confirmed, your active trips will show real-time progress here.</p>
                </div>
              )}

              {/* SCREEN 7: RIDES DONE */}
              {truckOwnerTab === 'rides-done' && (
                <div className="empty-state-card">
                  <div className="empty-icon">✅</div>
                  <h3>No Completed Ride History</h3>
                  <p>Your past completed freight deliveries and payment records will be archived here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* GOODS OWNER PORTAL                    */}
        {/* ===================================== */}
        {currentUser && currentUser.role === 'goods-owner' && (
          <div className="portal-layout">
            {/* PART 4: Goods Owner Sidebar */}
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
              <div className="sidebar-toggle-bar">
                <span className="sidebar-title">Goods Owner Menu</span>
                <button
                  className="sidebar-toggle-btn"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {isSidebarCollapsed ? '▶' : '◀'}
                </button>
              </div>

              <nav className="sidebar-nav">
                <button
                  className={`sidebar-item ${goodsOwnerTab === 'find-trucks' ? 'active' : ''}`}
                  onClick={() => setGoodsOwnerTab('find-trucks')}
                  title="Find Trucks"
                >
                  <span className="icon">🚚</span>
                  <span className="label">Find Trucks</span>
                </button>

                <button
                  className={`sidebar-item ${goodsOwnerTab === 'post-shipment' ? 'active' : ''}`}
                  onClick={() => setGoodsOwnerTab('post-shipment')}
                  title="Post Shipment"
                >
                  <span className="icon">➕</span>
                  <span className="label">Post Shipment</span>
                </button>

                <button
                  className={`sidebar-item ${goodsOwnerTab === 'my-shipments' ? 'active' : ''}`}
                  onClick={() => setGoodsOwnerTab('my-shipments')}
                  title="My Shipments"
                >
                  <span className="icon">📦</span>
                  <span className="label">My Shipments ({loads.length})</span>
                </button>

                <button
                  className={`sidebar-item ${goodsOwnerTab === 'requests-sent' ? 'active' : ''}`}
                  onClick={() => setGoodsOwnerTab('requests-sent')}
                  title="Requests Sent"
                >
                  <span className="icon">📤</span>
                  <span className="label">Requests Sent ({requestsSentList.length})</span>
                </button>

                <button
                  className={`sidebar-item ${goodsOwnerTab === 'bids-received' ? 'active' : ''}`}
                  onClick={() => setGoodsOwnerTab('bids-received')}
                  title="Bids Received"
                >
                  <span className="icon">📥</span>
                  <span className="label">Bids Received</span>
                </button>

                <button
                  className={`sidebar-item ${goodsOwnerTab === 'active-rides' ? 'active' : ''}`}
                  onClick={() => setGoodsOwnerTab('active-rides')}
                  title="Active Rides"
                >
                  <span className="icon">🛣️</span>
                  <span className="label">Active Rides</span>
                </button>

                <button
                  className={`sidebar-item ${goodsOwnerTab === 'ride-history' ? 'active' : ''}`}
                  onClick={() => setGoodsOwnerTab('ride-history')}
                  title="Ride History"
                >
                  <span className="icon">📜</span>
                  <span className="label">Ride History</span>
                </button>
              </nav>
            </aside>

            {/* Portal Canvas */}
            <div className="portal-canvas">
              <div className="dashboard-header">
                <div>
                  <h1 className="dash-title">
                    {goodsOwnerTab === 'find-trucks' && 'Find Available Trucks'}
                    {goodsOwnerTab === 'post-shipment' && 'Post Transport Requirement'}
                    {goodsOwnerTab === 'my-shipments' && 'My Posted Cargo Shipments'}
                    {goodsOwnerTab === 'requests-sent' && 'Booking Requests Sent'}
                    {goodsOwnerTab === 'bids-received' && 'Bids Received'}
                    {goodsOwnerTab === 'active-rides' && 'Active Shipments In Transit'}
                    {goodsOwnerTab === 'ride-history' && 'Shipment Ride History'}
                  </h1>
                  <p className="dash-sub">
                    {goodsOwnerTab === 'find-trucks' && 'Search available trucks across routes and request bookings.'}
                    {goodsOwnerTab === 'post-shipment' && 'Fill cargo details to receive bids from verified carriers.'}
                    {goodsOwnerTab === 'my-shipments' && 'Manage your posted freight requirements.'}
                    {goodsOwnerTab === 'requests-sent' && 'Booking requests submitted to truck operators.'}
                    {goodsOwnerTab === 'bids-received' && 'Carrier bid offers submitted for your shipments.'}
                    {goodsOwnerTab === 'active-rides' && 'In-transit freight currently moving.'}
                    {goodsOwnerTab === 'ride-history' && 'Past completed cargo shipments.'}
                  </p>
                </div>
                <span className="role-pill navy">📦 Goods Owner Mode</span>
              </div>

              {/* Summary Stats Header */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-icon">📦</span>
                  <div>
                    <div className="stat-value">{loads.length}</div>
                    <div className="stat-label">Posted Cargo Requirements</div>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">🚛</span>
                  <div>
                    <div className="stat-value">{trucks.length}</div>
                    <div className="stat-label">Available Trucks Nearby</div>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">📑</span>
                  <div>
                    <div className="stat-value">{requestsSentList.length}</div>
                    <div className="stat-label">Requests Sent</div>
                  </div>
                </div>
              </div>

              {/* SCREEN 1: FIND TRUCKS (DEFAULT) */}
              {goodsOwnerTab === 'find-trucks' && (
                <div>
                  <div className="card filter-card">
                    <div className="filter-header">
                      <h3 className="filter-title">Search & Filter Available Trucks</h3>
                      <span className="filter-count">
                        Showing {filteredTrucks.length} of {trucks.length} trucks
                        {hasActiveFilters && (
                          <button className="clear-btn" onClick={handleClearFilters}>Clear Filters</button>
                        )}
                      </span>
                    </div>

                    <div className="filter-row">
                      <input
                        type="text"
                        placeholder="Filter Current Location (e.g. Mumbai)"
                        value={searchPickup}
                        onChange={(e) => setSearchPickup(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Filter Destination"
                        value={searchDestination}
                        onChange={(e) => setSearchDestination(e.target.value)}
                      />
                      <select
                        value={filterVehicle}
                        onChange={(e) => setFilterVehicle(e.target.value)}
                      >
                        <option value="All">All Vehicle Types</option>
                        <option value="14ft Eicher">14ft Eicher</option>
                        <option value="32ft Container">32ft Container</option>
                        <option value="10-Wheeler Open Heavy">10-Wheeler Open</option>
                        <option value="Tata Ace">Tata Ace</option>
                        <option value="Trailer Multi-Axle">Trailer Multi-Axle</option>
                        <option value="20ft Container">20ft Container</option>
                      </select>
                    </div>
                  </div>

                  <div className="items-list">
                    {filteredTrucks.length === 0 ? (
                      <div className="empty-state-card">
                        <div className="empty-icon">🔍</div>
                        <h3>No Matching Trucks Found</h3>
                        <p>No available trucks match your location, destination, or vehicle type filters.</p>
                        {hasActiveFilters && (
                          <button className="btn btn-outline" onClick={handleClearFilters}>Clear Filters</button>
                        )}
                      </div>
                    ) : (
                      filteredTrucks.map((truck) => (
                        <div className="card item-card" key={truck.id}>
                          <div className="item-header">
                            <div>
                              <span className="item-id">{truck.regNumber}</span>
                              <h4 className="item-title">{truck.operator}</h4>
                              <span className="shipper-name">Rating: ★ {truck.rating} • Verified Carrier</span>
                            </div>
                            <div className="item-price">₹{truck.rate.toLocaleString('en-IN')}</div>
                          </div>

                          <div className="item-details">
                            <div className="detail-chip">
                              <span className="chip-label">Current Route</span>
                              <strong>{truck.location} ➔ {truck.destination}</strong>
                            </div>
                            <div className="detail-chip">
                              <span className="chip-label">Vehicle Spec</span>
                              <span>{truck.vehicleType}</span>
                            </div>
                            <div className="detail-chip">
                              <span className="chip-label">Payload Capacity</span>
                              <span>{truck.capacity}</span>
                            </div>
                          </div>

                          <div className="item-footer">
                            <span className={`status-tag ${truck.status === 'Available' ? 'green' : 'orange'}`}>
                              ● {truck.status}
                            </span>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleOpenBookingModal(truck)}
                              disabled={truck.status !== 'Available'}
                            >
                              {truck.status === 'Available' ? 'Book Truck Now' : 'Request Sent'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SCREEN 2: POST SHIPMENT (SEPARATE FORM SCREEN) */}
              {goodsOwnerTab === 'post-shipment' && (
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                  <div className="card form-card">
                    <h2 className="card-title">Post Transport Requirement</h2>
                    <form onSubmit={handlePostLoad}>
                      <div className="form-group">
                        <label>Cargo Description / Material *</label>
                        <input
                          type="text"
                          placeholder="e.g. Pharmaceutical Boxes / Cotton Bales"
                          value={loadForm.title}
                          onChange={(e) => setLoadForm({ ...loadForm, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Pickup City *</label>
                          <select
                            value={loadForm.pickup}
                            onChange={(e) => setLoadForm({ ...loadForm, pickup: e.target.value })}
                          >
                            <option value="Mumbai">Mumbai</option>
                            <option value="Pune">Pune</option>
                            <option value="Nashik">Nashik</option>
                            <option value="Nagpur">Nagpur</option>
                            <option value="Thane">Thane</option>
                            <option value="Kolhapur">Kolhapur</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Destination City *</label>
                          <select
                            value={loadForm.destination}
                            onChange={(e) => setLoadForm({ ...loadForm, destination: e.target.value })}
                          >
                            <option value="Pune">Pune</option>
                            <option value="Nagpur">Nagpur</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Nashik">Nashik</option>
                            <option value="Thane">Thane</option>
                            <option value="Kolhapur">Kolhapur</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Preferred Vehicle Type *</label>
                        <select
                          value={loadForm.vehicleType}
                          onChange={(e) => setLoadForm({ ...loadForm, vehicleType: e.target.value })}
                        >
                          <option value="14ft Eicher">14ft Eicher (Medium Container)</option>
                          <option value="32ft Container">32ft Multi-Axle Container</option>
                          <option value="10-Wheeler Open Heavy">10-Wheeler Open Body</option>
                          <option value="Tata Ace">Tata Ace (Small LCV)</option>
                          <option value="Trailer Multi-Axle">Trailer Heavy Multi-Axle</option>
                          <option value="20ft Container">20ft Container</option>
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Cargo Weight (Tons) *</label>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="e.g. 8"
                            value={loadForm.weight}
                            onChange={(e) => setLoadForm({ ...loadForm, weight: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Offered Rate (₹) *</label>
                          <input
                            type="number"
                            placeholder="e.g. 18000"
                            value={loadForm.price}
                            onChange={(e) => setLoadForm({ ...loadForm, price: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-secondary full-width"
                        disabled={isSubmittingLoad}
                        style={{ marginTop: '12px' }}
                      >
                        {isSubmittingLoad ? 'Posting...' : '+ Post Cargo Requirement'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* SCREEN 3: MY SHIPMENTS (SEPARATED FROM FORM) */}
              {goodsOwnerTab === 'my-shipments' && (
                <div>
                  <div className="section-top-bar">
                    <h2>Posted Requirements ({loads.length})</h2>
                    <button className="btn btn-secondary" onClick={() => setGoodsOwnerTab('post-shipment')}>
                      + Post New Cargo
                    </button>
                  </div>

                  <div className="items-list">
                    {loads.map((load) => (
                      <div className="card item-card" key={load.id}>
                        <div className="item-header">
                          <div>
                            <span className="item-id">{load.id}</span>
                            <h4 className="item-title">{load.title}</h4>
                            <span className="shipper-name">Shipper: {load.shipper}</span>
                          </div>
                          <div className="item-price">₹{load.price.toLocaleString('en-IN')}</div>
                        </div>

                        <div className="item-details">
                          <div className="detail-chip">
                            <span className="chip-label">Route</span>
                            <strong>{load.pickup} ➔ {load.destination}</strong>
                          </div>
                          <div className="detail-chip">
                            <span className="chip-label">Vehicle</span>
                            <span>{load.vehicleType}</span>
                          </div>
                          <div className="detail-chip">
                            <span className="chip-label">Weight</span>
                            <span>{load.weight}</span>
                          </div>
                        </div>

                        <div className="item-footer">
                          <span className="status-tag green">● {load.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCREEN 4: REQUESTS SENT */}
              {goodsOwnerTab === 'requests-sent' && (
                <div>
                  {requestsSentList.length === 0 ? (
                    <div className="empty-state-card">
                      <div className="empty-icon">📤</div>
                      <h3>No Booking Requests Sent</h3>
                      <p>You have not submitted booking requests for any trucks yet. Browse Find Trucks to book an operator.</p>
                      <button className="btn btn-secondary" onClick={() => setGoodsOwnerTab('find-trucks')}>
                        Browse Find Trucks
                      </button>
                    </div>
                  ) : (
                    <div className="items-list">
                      {requestsSentList.map((truck) => (
                        <div className="card item-card" key={truck.id}>
                          <div className="item-header">
                            <div>
                              <span className="item-id">{truck.regNumber}</span>
                              <h4 className="item-title">{truck.operator}</h4>
                              <span className="shipper-name">Rating: ★ {truck.rating}</span>
                            </div>
                            <div className="item-price">₹{truck.rate.toLocaleString('en-IN')}</div>
                          </div>

                          <div className="item-details">
                            <div className="detail-chip">
                              <span className="chip-label">Route</span>
                              <strong>{truck.location} ➔ {truck.destination}</strong>
                            </div>
                            <div className="detail-chip">
                              <span className="chip-label">Spec</span>
                              <span>{truck.vehicleType}</span>
                            </div>
                          </div>

                          <div className="item-footer">
                            <span className="status-tag orange">● Booking Request Pending Carrier Response</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 5: BIDS RECEIVED */}
              {goodsOwnerTab === 'bids-received' && (
                <div className="empty-state-card">
                  <div className="empty-icon">📥</div>
                  <h3>No Bids Received Yet</h3>
                  <p>When truck operators bid on your posted shipments, proposed bids will be listed here for review.</p>
                </div>
              )}

              {/* SCREEN 6: ACTIVE RIDES */}
              {goodsOwnerTab === 'active-rides' && (
                <div className="empty-state-card">
                  <div className="empty-icon">🛣️</div>
                  <h3>No Active Shipments In Transit</h3>
                  <p>Confirmed truck bookings currently transporting cargo will show live progress here.</p>
                </div>
              )}

              {/* SCREEN 7: RIDE HISTORY */}
              {goodsOwnerTab === 'ride-history' && (
                <div className="empty-state-card">
                  <div className="empty-icon">📜</div>
                  <h3>No Completed Shipment History</h3>
                  <p>Archive of past completed transport jobs and proof of delivery receipts will be kept here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* MODAL 1: ACCEPT & BID LOAD MODAL      */}
        {/* ===================================== */}
        {biddingLoad && (
          <div className="modal-overlay" onClick={() => setBiddingLoad(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Submit Freight Bid</h3>
                <button className="modal-close-btn" onClick={() => setBiddingLoad(null)}>×</button>
              </div>

              <div className="modal-summary-box">
                <div><strong>Cargo:</strong> {biddingLoad.title} ({biddingLoad.id})</div>
                <div><strong>Route:</strong> {biddingLoad.pickup} ➔ {biddingLoad.destination}</div>
                <div><strong>Shipper Rate:</strong> ₹{biddingLoad.price.toLocaleString('en-IN')} ({biddingLoad.weight} / {biddingLoad.vehicleType})</div>
              </div>

              <form onSubmit={handleConfirmBid}>
                <div className="form-group">
                  <label>Your Bid Amount (₹) *</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your proposed rate"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>Notes for Shipper (Optional)</label>
                  <input
                    type="text"
                    value={bidNotes}
                    onChange={(e) => setBidNotes(e.target.value)}
                    placeholder="e.g. Ready for immediate loading at warehouse"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setBiddingLoad(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Bid
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* MODAL 2: CONFIRM TRUCK BOOKING MODAL  */}
        {/* ===================================== */}
        {bookingTruckModal && (
          <div className="modal-overlay" onClick={() => setBookingTruckModal(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Confirm Truck Booking Request</h3>
                <button className="modal-close-btn" onClick={() => setBookingTruckModal(null)}>×</button>
              </div>

              <div className="modal-summary-box">
                <div><strong>Operator:</strong> {bookingTruckModal.operator}</div>
                <div><strong>Vehicle Reg:</strong> {bookingTruckModal.regNumber} ({bookingTruckModal.vehicleType})</div>
                <div><strong>Route:</strong> {bookingTruckModal.location} ➔ {bookingTruckModal.destination}</div>
                <div><strong>Quoted Rate:</strong> ₹{bookingTruckModal.rate.toLocaleString('en-IN')} ({bookingTruckModal.capacity})</div>
              </div>

              <form onSubmit={handleConfirmBooking}>
                <div className="form-group">
                  <label>Instruction / Notes for Carrier (Optional)</label>
                  <input
                    type="text"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g. Gate 3 loading tomorrow at 9 AM"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setBookingTruckModal(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-secondary">
                    Confirm & Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <p>© {new Date().getFullYear()} GoodShip Logistics Marketplace • India. Connecting Truck Owners & Businesses.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
