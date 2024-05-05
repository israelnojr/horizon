import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import { loggedIn } from '@/constants'
import React from 'react'

const Home = () => {
  return (
    <section className={`home`} >
      <div className="home-content">
      <header className="home-header">
        <HeaderBox 
          type="greeting"
          title='Welcome'
          user={loggedIn?.firstName || "Guest"}
          subtext="Access and manage your account and trasactions efficiently."
        />
      </header>
      <TotalBalanceBox 
        accounts={[]}
        totalBanks={5}
        totalCurrentBalance={18460.08}
      />
      </div>
    </section>
  )
}

export default Home