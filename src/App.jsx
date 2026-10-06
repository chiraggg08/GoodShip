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
    location: 'Kolhapur',
    destination: 'Pune',
    capacity: '1.5 Tons',
    rate: 7500,
    rating: '4.6',
    status: 'Available'
  }
]

function App() {
  // Navigation state: 'landing' | 'truck-owner' | 'goods-owner'
  const [currentView, setCurrentView] = useState('landing')

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
  // 1. Bid Modal state for Truck Owner bidding on a load
  const [biddingLoad, setBiddingLoad] = useState(null) // Load object or null
  const [bidAmount, setBidAmount] = useState('')
  const [bidNotes, setBidNotes] = useState('')

  // 2. Booking Modal state for Goods Owner booking a truck
  const [bookingTruckModal, setBookingTruckModal] = useState(null) // Truck object or null
  const [bookingNotes, setBookingNotes] = useState('')

  // Form States
  // 1. Truck Owner Listing Form
  const [truckForm, setTruckForm] = useState({
    regNumber: '',
    vehicleType: '14ft Eicher',
    location: 'Mumbai',
    destination: 'Pune',
    capacity: '',
    rate: ''
  })

  // 2. Goods Owner Post Load Form
  const [loadForm, setLoadForm] = useState({
    title: '',
    pickup: 'Mumbai',
    destination: 'Pune',
    vehicleType: '14ft Eicher',
    weight: '',
    price: '',
    shipper: 'My Enterprise'
  })

  // Toast Trigger Helper
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

  // 1. Validate & Add Truck
  const handleAddTruck = (e) => {
    e.preventDefault()
    const trimmedReg = truckForm.regNumber.trim().toUpperCase()
    const capacityNum = parseFloat(truckForm.capacity)
    const rateNum = parseFloat(truckForm.rate)

    // Form Validations
    if (!trimmedReg || trimmedReg.length < 5) {
      triggerToast('⚠️ Validation Error: Enter a valid Vehicle Number (e.g. MH 12 AB 1234).', 'error')
      return
    }
    if (truckForm.location === truckForm.destination) {
      triggerToast('⚠️ Validation Error: Current Location and Destination City cannot be the same.', 'error')
      return
    }
    if (isNaN(capacityNum) || capacityNum <= 0) {
      triggerToast('⚠️ Validation Error: Capacity must be a positive number of Tons.', 'error')
      return
    }
    if (isNaN(rateNum) || rateNum <= 0) {
      triggerToast('⚠️ Validation Error: Expected Price must be a valid positive amount in ₹.', 'error')
      return
    }

    const newTruck = {
      id: `TRK-${Math.floor(200 + Math.random() * 800)}`,
      regNumber: trimmedReg,
      operator: 'My Truck Fleet',
      vehicleType: truckForm.vehicleType,
      location: truckForm.location,
      destination: truckForm.destination,
      capacity: `${capacityNum} Tons`,
      rate: rateNum,
      rating: '5.0',
      status: 'Available'
    }

    setTrucks([newTruck, ...trucks])
    setTruckForm({
      regNumber: '',
      vehicleType: '14ft Eicher',
      location: 'Mumbai',
      destination: 'Pune',
      capacity: '',
      rate: ''
    })
    triggerToast(`✅ Truck ${newTruck.regNumber} (${newTruck.vehicleType}) added successfully!`, 'success')
  }

  // 2. Validate & Post Load Requirement
  const handlePostLoad = (e) => {
    e.preventDefault()
    const trimmedTitle = loadForm.title.trim()
    const weightNum = parseFloat(loadForm.weight)
    const priceNum = parseFloat(loadForm.price)

    // Form Validations
    if (!trimmedTitle || trimmedTitle.length < 3) {
      triggerToast('⚠️ Validation Error: Please enter a clear cargo description (at least 3 characters).', 'error')
      return
    }
    if (loadForm.pickup === loadForm.destination) {
      triggerToast('⚠️ Validation Error: Pickup City and Destination City cannot be the same.', 'error')
      return
    }
    if (isNaN(weightNum) || weightNum <= 0) {
      triggerToast('⚠️ Validation Error: Weight must be a positive number of Tons.', 'error')
      return
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('⚠️ Validation Error: Offered Price must be a positive amount in ₹.', 'error')
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
      shipper: loadForm.shipper.trim() || 'My Enterprise',
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
    triggerToast(`✅ Cargo requirement "${newLoad.title}" posted successfully!`, 'success')
  }

  // 3. Open Bid Modal for Load
  const handleOpenBidModal = (load) => {
    setBiddingLoad(load)
    setBidAmount(load.price)
    setBidNotes('')
  }

  // Submit Bid for Load
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

  // 4. Open Booking Confirmation Modal for Truck
  const handleOpenBookingModal = (truck) => {
    setBookingTruckModal(truck)
    setBookingNotes('')
  }

  // Confirm Truck Booking Request
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

  // 5. Filtered Lists Logic
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

      {/* Header & Main Navigation */}
      <header className="header">
        <div className="container header-container">
          <div className="logo" onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }} title="GoodShip Home">
            <span className="logo-icon">🚛</span>
            <span className="logo-text">GoodShip<span className="dot">.</span></span>
          </div>

          <nav className="nav-links">
            <button
              className={`nav-btn ${currentView === 'landing' ? 'active' : ''}`}
              onClick={() => setCurrentView('landing')}
            >
              Home
            </button>
            <button
              className={`nav-btn ${currentView === 'truck-owner' ? 'active' : ''}`}
              onClick={() => setCurrentView('truck-owner')}
            >
              Truck Owner Portal
            </button>
            <button
              className={`nav-btn ${currentView === 'goods-owner' ? 'active' : ''}`}
              onClick={() => setCurrentView('goods-owner')}
            >
              Goods Owner Portal
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Container */}
      <main>
        {/* ===================================== */}
        {/* VIEW 1: LANDING PAGE                  */}
        {/* ===================================== */}
        {currentView === 'landing' && (
          <div className="landing-view">
            {/* Hero Section */}
            <section className="hero">
              <div className="container hero-container">
                <div className="india-badge">🇮🇳 India's Smart Trucking Network</div>
                <h1 className="hero-headline">The smarter way to move goods.</h1>
                <p className="hero-description">
                  GoodShip connects truck owners directly with businesses needing freight transport across Maharashtra and India. Eliminate empty return trips, get instant loads, and book verified trucks.
                </p>

                {/* Role Selection Options */}
                <div className="role-cards">
                  <div className="role-card primary">
                    <div className="role-icon">🚛</div>
                    <h3>Truck Owner</h3>
                    <p>Find profitable loads for your trucks & reduce empty return trips.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setCurrentView('truck-owner')}
                    >
                      Enter Truck Owner Portal →
                    </button>
                  </div>

                  <div className="role-card secondary">
                    <div className="role-icon">📦</div>
                    <h3>Goods Owner</h3>
                    <p>Post freight requirements & connect with verified truck operators.</p>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCurrentView('goods-owner')}
                    >
                      Enter Goods Owner Portal →
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits">
              <div className="container">
                <div className="section-header">
                  <h2 className="section-title">Built for Smart Logistics</h2>
                  <p className="section-subtitle">Empowering carriers and shippers across major Indian commercial hubs</p>
                </div>

                <div className="benefits-grid">
                  <div className="benefit-card">
                    <div className="icon-wrapper">📦</div>
                    <h3>Find Loads</h3>
                    <p>
                      Access verified, high-paying cargo loads matching your truck type and preferred routes instantly.
                    </p>
                  </div>

                  <div className="benefit-card">
                    <div className="icon-wrapper">🚚</div>
                    <h3>Find Trucks</h3>
                    <p>
                      Discover available open body, container, and heavy trailer trucks ready for pickup near your warehouse.
                    </p>
                  </div>

                  <div className="benefit-card">
                    <div className="icon-wrapper">🔄</div>
                    <h3>Reduce Empty Trips</h3>
                    <p>
                      Eliminate deadhead miles on return corridors between Mumbai, Pune, Nashik, Nagpur, and beyond.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Popular Corridors */}
            <section className="corridors-section">
              <div className="container">
                <h3 className="corridors-title">Key Active Corridors in Maharashtra</h3>
                <div className="corridor-tags">
                  <span className="tag">📍 Mumbai ↔ Pune</span>
                  <span className="tag">📍 Pune ↔ Nagpur</span>
                  <span className="tag">📍 Nashik ↔ Mumbai</span>
                  <span className="tag">📍 Thane ↔ Kolhapur</span>
                  <span className="tag">📍 Nagpur ↔ Nashik</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================== */}
        {/* VIEW 2: TRUCK OWNER DASHBOARD         */}
        {/* ===================================== */}
        {currentView === 'truck-owner' && (
          <div className="dashboard-view container">
            <div className="dashboard-header">
              <div>
                <h1 className="dash-title">Truck Owner Portal</h1>
                <p className="dash-sub">List your trucks, search matching loads, and submit bids.</p>
              </div>
              <span className="role-pill green">🚛 Truck Owner Mode</span>
            </div>

            {/* Summary Cards */}
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
                  <div className="stat-value">{truckOwnerBookings}</div>
                  <div className="stat-label">Bids / Requests Placed</div>
                </div>
              </div>
            </div>

            {/* Form & Main Content Grid */}
            <div className="dashboard-grid">
              {/* Left Column: Form to List a Truck */}
              <div className="card form-card">
                <h2 className="card-title">List an Available Truck</h2>
                <form onSubmit={handleAddTruck}>
                  <div className="form-group">
                    <label>Vehicle Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. MH 12 AB 1234"
                      value={truckForm.regNumber}
                      onChange={(e) => setTruckForm({ ...truckForm, regNumber: e.target.value })}
                      required
                    />
                  </div>

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
                      <label>Preferred Destination *</label>
                      <select
                        value={truckForm.destination}
                        onChange={(e) => setTruckForm({ ...truckForm, destination: e.target.value })}
                      >
                        <option value="Pune">Pune</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Nagpur">Nagpur</option>
                        <option value="Nashik">Nashik</option>
                        <option value="Kolhapur">Kolhapur</option>
                        <option value="Thane">Thane</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Capacity (Tons) *</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="e.g. 10"
                        value={truckForm.capacity}
                        onChange={(e) => setTruckForm({ ...truckForm, capacity: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Expected Price (₹) *</label>
                      <input
                        type="number"
                        placeholder="e.g. 25000"
                        value={truckForm.rate}
                        onChange={(e) => setTruckForm({ ...truckForm, rate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary full-width">
                    + Add Truck to Fleet
                  </button>
                </form>
              </div>

              {/* Right Column: Search & Available Loads List */}
              <div className="list-container">
                <div className="card filter-card">
                  <div className="filter-header">
                    <h3 className="filter-title">Find Loads for Your Trucks</h3>
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

                {/* Available Loads List */}
                <div className="items-list">
                  {filteredLoads.length === 0 ? (
                    <div className="empty-state">
                      No loads match your current filter criteria. Try clearing search filters.
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
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* VIEW 3: GOODS OWNER DASHBOARD         */}
        {/* ===================================== */}
        {currentView === 'goods-owner' && (
          <div className="dashboard-view container">
            <div className="dashboard-header">
              <div>
                <h1 className="dash-title">Goods Owner Portal</h1>
                <p className="dash-sub">Post cargo requirements, find available trucks, and request bookings.</p>
              </div>
              <span className="role-pill navy">📦 Goods Owner Mode</span>
            </div>

            {/* Summary Cards */}
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
                  <div className="stat-value">{goodsOwnerBookings}</div>
                  <div className="stat-label">Bookings Requested</div>
                </div>
              </div>
            </div>

            {/* Form & Main Content Grid */}
            <div className="dashboard-grid">
              {/* Left Column: Form to Post Goods Requirement */}
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
                      <label>Weight (Tons) *</label>
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

                  <button type="submit" className="btn btn-secondary full-width">
                    + Post Cargo Requirement
                  </button>
                </form>
              </div>

              {/* Right Column: Search & Available Trucks List */}
              <div className="list-container">
                <div className="card filter-card">
                  <div className="filter-header">
                    <h3 className="filter-title">Find Available Trucks</h3>
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

                {/* Available Trucks List */}
                <div className="items-list">
                  {filteredTrucks.length === 0 ? (
                    <div className="empty-state">
                      No trucks match your current filter criteria. Try clearing search filters.
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
