'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconTournament } from '@tabler/icons-react';
import { Search, X, ChevronRight, Calendar, Clock, Users, Award } from 'lucide-react';

const TournamentModal = ({ isOpen, onClose, tournament }) => {
  if (!isOpen) return null;

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0  flex items-center justify-center z-50 p-4 sm:p-6 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-secondary  max-w-3xl w-full max-h-[90vh] overflow-y-auto angular-cut shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header with close button */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#1f2731]">
          <h3 className="text-xl sm:text-2xl font-valorant text-white">{tournament.title || 'Tournament Details'}</h3>
          <button 
            onClick={onClose}
            className="text-[#647693] hover:text-primary transition-colors p-2 rounded-full hover:bg-[#1f2731]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-4 sm:p-6">
          {/* Hero image */}
          <div className="w-full h-64 sm:h-80 relative overflow-hidden mb-6 rounded-md">
            <div
              className="absolute inset-0 transform hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage: `url('${tournament.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Badge */}
            <div className="absolute top-0 right-0 m-4">
              <span className={`${tournament.badgeColor || 'bg-primary'} text-xs py-1.5 px-3 font-valorant text-white rounded-sm flex items-center gap-1.5 shadow-lg`}>
                <span>{tournament.badgeIcon || '⭐'}</span> {tournament.badge || 'Tournament'}
              </span>
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Tournament info - Improved grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-primary text-xs mb-3 font-valorant tracking-wider">DESCRIPTION</h4>
              <p className="text-white text-sm leading-relaxed">
                {tournament.description}
              </p>
              
              {/* Creator info - Moved here for better layout */}
              <div className="flex items-center mt-6  p-3 rounded-md ">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary shadow-lg">
                  <img src={tournament.avatar} alt="Creator" className="w-full h-full object-cover" />
                </div>
                <div>
                  {/* <div className="text-primary text-xs mb-1 font-valorant tracking-wider">TOURNAMENT CREATOR</div> */}
                  <div className="text-white text-sm font-medium">{tournament.creator}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-primary text-xs mb-3 font-valorant tracking-wider">DETAILS</h4>
              <div className="grid grid-cols-1 gap-4  p-4 rounded-md ">
                <div className="flex items-center">
                  <Calendar size={18} className="text-primary mr-3" />
                  <div>
                    <div className="text-[#647693] text-xs mb-1">DATE</div>
                    <div className="text-white text-sm font-medium">{tournament.date}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="text-primary mr-3" />
                  <div>
                    <div className="text-[#647693] text-xs mb-1">TIME</div>
                    <div className="text-white text-sm font-medium">{tournament.time}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users size={18} className="text-primary mr-3" />
                  <div>
                    <div className="text-[#647693] text-xs mb-1">PLAYERS</div>
                    <div className="text-white text-sm font-medium">{tournament.players}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Award size={18} className="text-primary mr-3" />
                  <div>
                    <div className="text-[#647693] text-xs mb-1">PRIZE POOL</div>
                    <div className="text-white text-sm font-medium">{tournament.prizePool}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="group relative bg-primary text-white flex items-center h-12 w-full rounded-sm overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300">
              <div className="absolute left-0 top-0 bg-white/10 h-full w-0 transition-all duration-500 ease-out group-hover:w-full"></div>
              <div className="h-12 w-full flex items-center justify-between">
                <span className="relative px-5 z-10 font-custom font-normal tracking-wider text-white uppercase">
                  {tournament.buttonText || "Join Tournament"}
                </span>
                <span className="text-white font-custom transition-all duration-300 transform translate-x-0 group-hover:translate-x-2 mr-5">
                  <ChevronRight size={20} />
                </span>
              </div>
            </button>
            
            <button 
              onClick={onClose} 
              className="group relative bg-[#1f2731] text-white flex items-center h-12 w-full rounded-sm hover:bg-[#283545] transition-all duration-300"
            >
              <div className="h-12 w-full flex items-center justify-center">
                <span className="font-custom font-normal tracking-wider text-white uppercase">
                  Close
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};





const PassCard = ({ 
  badgeText = "Tournament", 
  badgeColor = "bg-primary", 
  badgeIcon = "⭐",
  avatarSrc = "https://i.pravatar.cc/100", 
  creatorName = "Tournament Creator",
  tournament = {} 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMoreDetails = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <div 
        className="group relative w-full h-full font-pilot overflow-hidden bg-dark border border-[#1f2731]/50 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-primary/10 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMoreDetails}
      >
        
        {/* Main content container with proper z-index */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Image section with hover effect */}
          <div className="w-full h-48 relative overflow-hidden">
            {/* Glowing border on hover */}
            <div className={`absolute inset-0 border-b-2 border-transparent z-30 transition-all duration-500 ${isHovered ? 'border-primary shadow-[0_4px_10px_rgba(0,162,255,0.3)]' : ''}`}></div>
            
            {/* Image with scale effect */}
            <div
              className={`absolute inset-0 transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
              style={{
                backgroundImage: `url('${tournament.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            
            {/* Enhanced overlay with better gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a111a] via-[#0a111a]/70 to-[#0a111a]/30 z-10"></div>
            
            {/* Badge positioned at top right with cyberpunk styling */}
            <div className="absolute top-3 right-3 z-30">
              <span className={`${badgeColor} text-xs py-1.5 px-2 font-valorant text-white shadow-lg flex items-center gap-1.5 clip-edge`}>
                <span>{badgeIcon}</span> {badgeText}
              </span>
            </div>
            
            {/* View details indicator in top-right corner */}
            <div className="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-primary text-xs py-1 px-2 font-valorant text-white flex items-center gap-1">
                <ChevronRight size={14} className="text-white transition-transform group-hover:translate-x-1" />
                <span>VIEW</span>
              </span>
            </div>
          </div>
          
          {/* Content section with improved layout */}
          <div className="flex-1 flex flex-col p-4 relative">
            {/* Title with better positioning and style */}
            <h2 className="text-white font-valorant text-lg font-medium line-clamp-2 mb-3 mt-1 tracking-wide group-hover:text-primary transition-colors duration-300">
              {tournament.title}
            </h2>
            
            {/* Key tournament details with cleaner layout */}
            <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Calendar size={14} className={`text-primary mr-2 transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`} />
                <span className="text-[#647693] text-xs">{tournament.date}</span>
              </div>
              <div className="flex items-center">
                <Users size={14} className={`text-primary mr-2 transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`} />
                <span className="text-[#647693] text-xs">{tournament.players}</span>
              </div>
              <div className="flex items-center col-span-2 mt-1">
                <div className="w-5 h-5 rounded-full overflow-hidden mr-2 border border-primary/50 flex-shrink-0">
                  <img src={avatarSrc} alt={creatorName} className="w-full h-full object-cover" />
                </div>
                <span className="text-[#647693] text-xs truncate">{creatorName}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hover indicator lines */}
        <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 origin-left transition-transform duration-500 ${isHovered ? 'scale-x-100' : ''}`}></div>
        <div className={`absolute top-0 right-0 h-full w-0.5 bg-primary scale-y-0 origin-top transition-transform duration-500 ${isHovered ? 'scale-y-100' : ''}`}></div>
      </div>
      
      {/* Modal */}
      <TournamentModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        tournament={{
          title: tournament.title,
          badge: badgeText,
          badgeColor: badgeColor,
          badgeIcon: badgeIcon,
          creator: creatorName,
          avatar: avatarSrc,
          description: tournament.description,
          date: tournament.date,
          time: tournament.time,
          players: tournament.players,
          prizePool: tournament.prizePool,
          buttonText: tournament.buttonText,
          ...tournament
        }}
      />
    </>
  );
};

const ImageCardGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Improved filters with consistent styling
  const filters = [
    { id: 'all', label: 'Tous', icon: '⭐' },
    { id: 'sport', label: 'Sport', color: 'bg-red-500', icon: '🏆' },
    { id: 'hebergement', label: 'Hebergement', color: 'bg-orange-500', icon: '🏠' },
    { id: 'sante', label: 'Sante', color: 'bg-blue-500', icon: '🩺' },
    { id: 'loisir', label: 'Loisir', color: 'bg-yellow-500', icon: '🎮' }
  ];

  // Original items based on the youth services app image
  const originalItems = [
    {
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Pass Jeunes Sante Tournament',
      description: 'Rejoignez le tournoi organisé par Omnidoc qui réunit des jeunes passionnés par les questions de santé. Vous avez entre 18 et 30 ans? Participez à notre compétition pour gagner une couverture santé complète pour une année entière. Les équipes s\'affronteront dans des défis d\'innovation en matière de santé numérique.',
      link: '/tournaments/pass-jeunes',
      badge: 'Sante',
      badgeColor: 'bg-blue-500',
      badgeIcon: '🩺',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      creator: ' Universite Mohammed VI Polytechnique',
      date: 'Juin 15, 2025',
      time: '15:00 GMT',
      players: '48/64',
      prizePool: '25,000 MAD',
      buttonText: 'S\'inscrire maintenant',
      category: 'sante'
    },
    {
      image: 'https://images.unsplash.com/photo-1568952433726-3896e3881c65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Morocco Digital Academy Challenge',
      description: 'L\'Académie Numérique du Maroc vous invite à participer à son tournoi de programmation. Rejoignez la 3ème cohorte et démontrez vos compétences en développement, intelligence artificielle et cybersécurité. Les finalistes pourront intégrer notre programme de formation d\'élite et les gagnants recevront des bourses complètes.',
      link: '/tournaments/digital-academy',
      badge: 'Loisir',
      badgeColor: 'bg-yellow-500',
      badgeIcon: '🎮',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      creator: 'Universite Mohammed VI Polytechnique',
      date: 'Mars 31, 2025',
      time: '09:00 GMT',
      players: '126/200',
      prizePool: 'Bourses d\'études',
      buttonText: 'Postuler',
      category: 'loisir'
    },
    {
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Prix Maroc Jeunesse Championship',
      description: 'Le prestigieux tournoi annuel du Prix Maroc Jeunesse réunissant les talents marocains dans diverses disciplines: arts, sciences, entrepreneuriat et innovation sociale. Les participants auront l\'occasion de présenter leurs projets devant un jury de renommée nationale et internationale, avec à la clé des financements importants.',
      link: '/tournaments/prix-jeunesse',
      badge: 'Sport',
      badgeColor: 'bg-red-500',
      badgeIcon: '🏆',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      creator: 'Fondation Prix Maroc Jeunesse',
      date: 'Mai 20, 2025',
      time: '14:00 GMT',
      players: '78/150',
      prizePool: '100,000 MAD',
      buttonText: 'Soumettre un projet',
      category: 'sport'
    },
    {
      image: 'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1173&q=80',
      title: 'Al Omrane Gaming Challenge',
      description: 'Une offre exclusive pour les jeunes gamers! Al Omrane et le Pass jeunes s\'unissent pour vous proposer un tournoi exceptionnel avec des prix immobiliers à la clé. Gagnez des réductions sur l\'achat de votre premier logement ou même un appartement pour le grand vainqueur. Ouvert aux joueurs de 21 à 35 ans.',
      link: '/tournaments/al-omrane',
      badge: 'Hebergement',
      badgeColor: 'bg-orange-500',
      badgeIcon: '🏠',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      creator: 'Groupe Al Omrane',
      date: 'Février 28, 2025',
      time: '18:00 GMT',
      players: '500/500',
      prizePool: 'Appartement + Réductions',
      buttonText: 'Voir les résultats',
      category: 'hebergement'
    },
    // Additional items included from your original code
    // (I've kept all the additional items from your original code)
    // Sport category items
    {
      image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Championnat National des Jeunes Footballeurs',
      description: 'Le plus grand tournoi de football pour les jeunes au Maroc. Organisé par la Fédération Royale Marocaine de Football, ce championnat offre aux talents de 15 à 18 ans l\'opportunité d\'être repérés par des recruteurs professionnels. Les matchs se dérouleront dans plusieurs villes du royaume.',
      link: '/tournaments/football-jeunes',
      badge: 'Sport',
      badgeColor: 'bg-red-500',
      badgeIcon: '🏆',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      creator: 'Fédération Royale Marocaine de Football',
      date: 'Juillet 10-25, 2025',
      time: 'Divers horaires',
      players: '320/400',
      prizePool: 'Contrats professionnels + 50,000 MAD',
      buttonText: 'Inscrire mon équipe',
      category: 'sport'
    },
    {
      image: 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Marathon de Casablanca Jeunes',
      description: 'Édition spéciale pour les jeunes de 16 à 25 ans du célèbre Marathon de Casablanca. Parcours de 10km à travers les quartiers emblématiques de la ville. Un excellent moyen de découvrir la métropole tout en pratiquant une activité sportive. Des bourses sportives seront offertes aux meilleurs coureurs.',
      link: '/tournaments/marathon-casa',
      badge: 'Sport',
      badgeColor: 'bg-red-500',
      badgeIcon: '🏆',
      avatar: 'https://images.unsplash.com/photo-1618082382324-e29ec1e6d784?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      creator: 'Casablanca Events & Animation',
      date: 'Septembre 5, 2025',
      time: '07:00 GMT',
      players: '578/1500',
      prizePool: 'Bourses sportives + Équipements',
      buttonText: 'Réserver ma place',
      category: 'sport'
    },
    // Additional categories and items remain the same...
    // Sante category items
    {
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Hackathon Sante Digitale',
      description: 'Un weekend d\'innovation pour réinventer la santé numérique au Maroc. Organisé par le Ministère de la Santé en partenariat avec des startups e-santé, ce hackathon invite les jeunes développeurs, designers et professionnels de santé à créer des solutions innovantes pour améliorer l\'accès aux soins.',
      link: '/tournaments/hackathon-sante',
      badge: 'Sante',
      badgeColor: 'bg-blue-500',
      badgeIcon: '🩺',
      avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      creator: 'Ministère de la Sante',
      date: 'Août 12-14, 2025',
      time: '09:00 GMT',
      players: '156/200',
      prizePool: 'Financement de 250,000 MAD',
      buttonText: 'Inscrire mon équipe',
      category: 'sante'
    },
    {
      image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Tournoi des Futurs Medecins',
      description: 'Compétition académique destinée aux étudiants en médecine de tout le royaume. Organisée par l\'Association des Étudiants en Médecine du Maroc, ce tournoi teste les connaissances médicales et les compétences pratiques des participants à travers plusieurs épreuves théoriques et mises en situation cliniques.',
      link: '/tournaments/futurs-medecins',
      badge: 'Sante',
      badgeColor: 'bg-blue-500',
      badgeIcon: '🩺',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1464&q=80',
      creator: 'Association des Étudiants en Medecine',
      date: 'Octobre 22-24, 2025',
      time: '10:00 GMT',
      players: '240/300',
      prizePool: 'Stages internationaux + Équipements médicaux',
      buttonText: 'Vérifier mon éligibilité',
      category: 'sante'
    },
    // And all other categories with their respective items
    // Hebergement category items
    {
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Concours d\'Architecture Durable',
      description: 'Imaginez l\'habitat étudiant de demain! Le Groupe Al Omrane lance un concours d\'architecture destiné aux étudiants et jeunes diplômés pour concevoir des logements étudiants écologiques et abordables. Les projets devront intégrer des solutions innovantes tout en respectant le patrimoine architectural marocain.',
      link: '/tournaments/architecture-durable',
      badge: 'Hebergement',
      badgeColor: 'bg-orange-500',
      badgeIcon: '🏠',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      creator: 'Groupe Al Omrane & École d\'Architecture',
      date: 'Avril 15 - Juillet 30, 2025',
      time: 'Soumission en ligne',
      players: '182/250',
      prizePool: 'Réalisation du projet + 200,000 MAD',
      buttonText: 'Soumettre mon projet',
      category: 'hebergement'
    },
    {
      image: 'https://images.unsplash.com/photo-1542629458-eaa56d608062?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Camp Immobilier Jeunesse',
      description: 'Premier salon immobilier dédié exclusivement aux jeunes de 25 à 35 ans. Visitez les stands des promoteurs proposant des offres spéciales pour l\'acquisition d\'un premier logement. Bénéficiez de conseils personnalisés, d\'ateliers sur le financement et participez à la loterie pour gagner l\'acompte de votre futur appartement!',
      link: '/tournaments/camp-immobilier',
      badge: 'Hebergement',
      badgeColor: 'bg-orange-500',
      badgeIcon: '🏠',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      creator: 'Fédération des Promoteurs Immobiliers',
      date: 'Mai 5-8, 2025',
      time: '10:00-19:00 GMT',
      players: '720/1000',
      prizePool: 'Acompte immobilier + Réductions exclusives',
      buttonText: 'Réserver mon badge',
      category: 'hebergement'
    },
    // Loisir category items
    {
      image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
      title: 'Festival du Film Jeunesse Marocain',
      description: 'Le plus grand concours de courts-métrages réalisés par les jeunes talents marocains de moins de 30 ans. Présentez votre œuvre dans l\'une des catégories: fiction, documentaire, animation ou téléphone portable. Les films sélectionnés seront projetés lors d\'un festival à Marrakech en présence de grands noms du cinéma.',
      link: '/tournaments/festival-film',
      badge: 'Loisir',
      badgeColor: 'bg-yellow-500',
      badgeIcon: '🎮',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      creator: 'Centre Cinématographique Marocain',
      date: 'Novembre 10-15, 2025',
      time: 'Projections diverses',
      players: '289/400',
      prizePool: 'Production professionnelle + 150,000 MAD',
      buttonText: 'Soumettre mon film',
      category: 'loisir'
    },
    {
      image: 'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      title: 'E-Sports Morocco Cup',
      description: 'Le plus grand tournoi d\'e-sports du royaume organisé en partenariat avec la Fédération Royale Marocaine des Jeux Électroniques. Compétitions sur plusieurs jeux populaires: FIFA, Fortnite, League of Legends et Valorant. Les finales se tiendront en présentiel à Casablanca avec retransmission en direct sur les chaînes nationales.',
      link: '/tournaments/esports-cup',
      badge: 'Loisir',
      badgeColor: 'bg-yellow-500',
      badgeIcon: '🎮',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      creator: 'Fédération Royale Marocaine des Jeux Électroniques',
      date: 'Décembre 3-5, 2025',
      time: 'Horaires variés',
      players: '2560/3000',
      prizePool: '500,000 MAD + Équipements Gaming',
      buttonText: 'Rejoindre la compétition',
      category: 'loisir'
    }
  ];

  // Use useEffect to filter items when search term or active filter changes
  useEffect(() => {
    const filtered = originalItems.filter(item => {
      const matchesFilter = activeFilter === 'all' || item.category === activeFilter.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    setFilteredItems(filtered);
  }, [searchTerm, activeFilter]);

  // Function to handle clearing search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-secondary text-white p-4 sm:p-6 md:p-8">
      {/* Header section with improved styling */}
      <div className="my-8">
        <div className="flex items-center text-primary mb-2">
          <IconTournament className="mr-2" size={24} />
          <p className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider">SURPASS & TRIUMPH</p>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-custom tracking-wider text-white mb-2">Pass Gamers</h1>
        {/* <p className="text-[#647693] max-w-2xl">Explorez les compétitions exclusives et tournois disponibles pour les membres Pass Jeunes. Rejoignez la communauté gaming marocaine.</p> */}
      </div>

      {/* Search and Filter section with improved UX */}
      <div className="mb-8 max-w-6xl">
        {/* Search bar with focus effects */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Rechercher par mot-clé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-full px-4 py-3 pl-10 focus:outline-none transition-all duration-300 
              ${isSearchFocused ? 'bg-[#151f2a] border-primary' : 'bg-dark border-[#1f2731]'} 
             angular-cut text-white`}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          {searchTerm && (
            <button 
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter badges with improved interactive styling */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 font-valorant text-sm rounded-md transition-all duration-300 flex items-center gap-2
                ${activeFilter === filter.id
                  ? filter.color || 'bg-primary'
                  : 'bg-dark hover:bg-[#1f2731]'}`}
            >
              <span>{filter.icon}</span> {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Display message when no results found */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-[#647693] mb-4 text-5xl">🔍</div>
          <h3 className="text-xl font-valorant text-white mb-2">Aucun résultat trouvé</h3>
          <p className="text-[#647693] max-w-md">
            Aucun tournoi ne correspond à votre recherche. Essayez d autres mots-clés ou catégories.
          </p>
        </div>
      )}

      {/* Responsive grid with improved layout and spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <PassCard 
            key={index} 
            badgeText={item.badge} 
            badgeColor={item.badgeColor}
            badgeIcon={item.badgeIcon}
            avatarSrc={item.avatar}
            creatorName={item.creator}
            tournament={item}
          />
        ))}
      </div>
      
   
    </div>
  );
};

export default ImageCardGrid;