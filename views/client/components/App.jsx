import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material";

const App = () => {
  const theme = useTheme();

  return (
    <Stack>
      <Typography variant="h1" color={theme.palette.secondary.main}>
        WittCode's Blog
      </Typography>

      <Typography variant="body1" color={theme.palette.primary.main}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dictum leo
        eu nulla aliquam, sed mollis turpis eleifend. Mauris dictum tellus mi,
        sed dictum lectus maximus in. pellentesque lorem, et dapibus augue
        pulvinar vel. Nulla rhoncus augue purus, a interdum odio facilisis sed.
        In porta condimentum eros nec aliquet. Nullam luctus bibendum ante.
        Pellentesque varius, justo vestibulum maximus aliquet, lectus neque
        volutpat ligula, consequat ornare tellus est eget metus. Sed rutrum non
        odio vel viverra. Proin pharetra ante nec nisi pulvinar dignissim.
        Curabitur sit amet vestibulum ligula. Orci varius natoque penatibus et
        magnis dis parturient montes, nascetur ridiculus mus. Donec ut diam in
        turpis blandit cursus. Aenean et volutpat nisi. Vivamus et tortor odio.
        Praesent tristique luctus nulla, vel ultrices ipsum vehicula vel.
        Quisque tempor aliquam libero, a posuere lorem hendrerit et. In lectus
        urna, tincidunt in tempus vitae, fringilla vitae ante. In quam lacus,
        viverra sit amet volutpat eget, imperdiet eget eros. Sed a viverra
        tortor, ultrices placerat arcu. Aliquam ac tellus in est dictum maximus
        vel interdum lectus. Ut sed enim facilisis, dapibus eros eget, tincidunt
        urna. Phasellus et semper lacus, eget rhoncus tellus. Proin malesuada
        vulputate lacinia. Sed eu pharetra augue. Nunc ornare malesuada urna
        egestas fringilla. Donec in ullamcorper massa, ut finibus arcu.
        Curabitur laoreet luctus diam, convallis euismod quam consectetur
        gravida. Nam ligula turpis, maximus id aliquam eu, tincidunt a nisl.
        Donec elit diam, scelerisque ac elementum sed, mattis ut velit. Quisque
        at interdum ex. Sed euismod velit at orci rutrum, at dapibus eros
        ornare. Sed in turpis non est placerat euismod. Nullam eu enim
        fringilla, bibendum turpis sit amet, fringilla mauris. Donec eu augue
        tortor. Class aptent taciti sociosqu ad litora torquent per conubia
        nostra, per inceptos himenaeos. Vivamus hendrerit justo nunc, laoreet
        interdum turpis ornare congue. Praesent id euismod leo, ac blandit
        magna. Nulla interdum lorem enim, vel dapibus erat auctor convallis.
        Donec tristique est quis dolor sagittis, id maximus neque elementum.
        Donec venenatis ornare urna eget cursus. Sed sit amet nisl aliquet,
        auctor nunc vitae, tincidunt turpis. Duis vitae facilisis mauris.
        Quisque varius semper luctus. Mauris at elementum felis. Fusce non mi
        tincidunt leo congue rhoncus. Mauris sit amet porta orci. Nam a suscipit
        turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
        posuere cubilia curae; Nam nibh ligula, porttitor a venenatis vitae,
        imperdiet ut elit. Praesent vitae sodales sapien. Pellentesque nec leo
        vitae tellus tristique vulputate. Praesent rhoncus condimentum turpis.
        Pellentesque mattis dolor eget augue finibus pretium. Nunc quis commodo
        tellus. Cras condimentum diam interdum enim venenatis malesuada eu in
        urna. Duis feugiat convallis nulla, sed faucibus lacus sollicitudin sit
        amet. Sed accumsan tellus orci, sed tincidunt erat condimentum et.
        Suspendisse ullamcorper libero ac lobortis dictum. In hac habitasse
        platea dictumst. Cras eget sagittis erat, id sagittis sapien. Nulla
        elementum massa nec velit mollis sollicitudin. Ut sit amet nunc a libero
        fermentum venenatis ut non felis. Integer quis euismod diam. Integer ut
        pulvinar risus, nec porttitor risus. In convallis ipsum non venenatis
        tincidunt. Suspendisse ullamcorper laoreet enim, et pretium urna congue
        at.
      </Typography>
    </Stack>
  );
};

export default App;
