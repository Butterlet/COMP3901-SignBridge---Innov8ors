import React from 'react';
import sheritaImage from '../assets/Sherita.png';
import aslImage from '../assets/asl-image.jpeg';
import herbieImage from '../assets/Herbie.png';
import kimImage from '../assets/Kim-Blake.jpg';

const HistoryPage = () => {
  const historySections = [
    {
      title: "Origins of JSL",
      content: "Jamaican Sign Language (JSL) is a complete, complex language that employs signs made with the hands and other movements, including facial expressions and postures of the body. It is the first language of many deaf Jamaicans, and one of several communication options available to deaf people.",
      image: sheritaImage,
      caption: "Sherita Gordon - Deaf Culture Facilitator of Danny Williams School for the Deaf"
    },
    {
      title: "Early Development",
      content: "JSL developed in the early 20th century, influenced by American Sign Language (ASL) brought by missionaries and educators. The first school for the deaf in Jamaica was established in 1937, which played a crucial role in standardizing JSL.",
      image: aslImage,
      caption: "Early ASL influence on Jamaican Sign Language"
    },
    {
      title: "Recognition as a Language",
      content: "For many years, JSL was not recognized as a true language. Through the work of linguists and deaf advocates in the 1970s and 1980s, JSL gained recognition as a distinct language with its own grammar and syntax.",
      image: herbieImage,
      caption: "Mr. Herbert 'Herbie' Hall - Former Chairman of JAD and significant advocate for the deaf community in Jamaica"
    },
    {
      title: "Modern JSL",
      content: "Today, JSL is recognized as a complete language and is used in education, media, and daily communication across Jamaica. The Jamaican Association for the Deaf (JAD) continues to promote and develop JSL resources for the community.",
      image: kimImage,
      caption: "Kimberly Sherlock Marriot-Blake - Executive Director of JAD"
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: '3rem',
        color: '#1f2937'
      }}>
        The History of Jamaican Sign Language
      </h1>

      {historySections.map((section, index) => (
        <div 
          key={index}
          style={{ 
            display: 'flex', 
            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '3rem',
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
            alignItems: 'center'
          }}
        >
          {/* Image Section */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ 
              background: '#f3f4f6',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <img 
                src={section.image} 
                alt={section.title}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
            {section.caption && (
              <p style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#6b7280',
                marginTop: '0.75rem',
                fontStyle: 'italic'
              }}>
                {section.caption}
              </p>
            )}
          </div>
          
          {/* Text Section */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h2 style={{ 
              fontSize: '1.875rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              color: '#1f2937',
              borderLeft: '4px solid #3b82f6',
              paddingLeft: '1rem'
            }}>
              {section.title}
            </h2>
            <p style={{ 
              color: '#374151', 
              lineHeight: '1.7',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}>
              {section.content}
            </p>
          </div>
        </div>
      ))}

      {/* Timeline Section */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        marginTop: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem', 
          textAlign: 'center',
          color: '#1f2937'
        }}>
          Key Milestones in JSL History
        </h2>
         <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {[
            { year: '1938', text: 'Jamaica Association for the Deaf established' },
            { year: "1940's", text: 'St. Christopher\'s School for the Deaf opened in St. Ann' },
            { year: "1990's", text: 'Deaf Advancement Programme launched' },
            { year: '2003', text: 'JAD support Deaf community advocacy for drivers licences' }
          ].map((item, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              marginBottom: '1rem',
              padding: '0.75rem',
              background: 'white',
              borderRadius: '0.5rem',
              alignItems: 'center'
            }}>
              <div style={{ 
                width: '80px', 
                fontWeight: 'bold',
                color: '#3b82f6',
                fontSize: '1rem'
              }}>
                {item.year}
              </div>
              <div style={{ color: '#334155' }}>
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;